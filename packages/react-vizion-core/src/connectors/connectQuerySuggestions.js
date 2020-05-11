import PropTypes from 'prop-types';
import createConnector from '../core/createConnector';
import {
  cleanUpValue,
  refineValue,
  getCurrentRefinementValue,
} from '../core/indexUtils';

const getId = () => 'query';

const getCurrentRefinement = (props, searchState, context) => {
  const id = getId(props);
  const currentRefinement = getCurrentRefinementValue(
    props,
    searchState,
    context,
    id,
    ''
  );

  if (currentRefinement) {
    return currentRefinement;
  }
  return '';
};

const refine = (props, searchState, nextRefinement, context) => {
  const id = getId();
  const nextValue = { [id]: nextRefinement };
  const resetPage = true;
  return refineValue(searchState, nextValue, context, resetPage);
};

const cleanUp = (props, searchState, context) => {
  return cleanUpValue(searchState, context, getId());
};

const getResults = searchResults => {
  if (searchResults && searchResults.resultsQuerySuggestions) {
    return searchResults.resultsQuerySuggestions;
  }

  return null;
};

/**
 * connectQuerySuggestions connector provides the logic to build a widget that will
 * let the user search for a query
 * @name connectQuerySuggestions
 * @kind connector
 * @propType {string} [defaultRefinement] - Provide a default value for the query
 * @providedPropType {function} refine - a function to change the current query
 * @providedPropType {function} searchForQuerySuggestions - a function to search for suggestions
 * @providedPropType {string} currentRefinement - the current query used
 * @providedPropType {array} hits - the current query suggestions
 */
export default createConnector({
  displayName: 'CliniaQuerySuggestions',

  propTypes: {
    defaultRefinement: PropTypes.string,
    queryType: PropTypes.string,
    perPage: PropTypes.number,
    highlightPreTag: PropTypes.string,
    highlightPostTag: PropTypes.string,
    facetFilters: PropTypes.array,
  },

  defaultProps: {
    queryType: 'prefix_last',
    perPage: 5,
    highlightPreTag: `<cvi-highlight-0000000000>`,
    highlightPostTag: `</cvi-highlight-0000000000>`,
    facetFilters: [],
  },

  getProvidedProps(props, searchState, searchResults, _meta) {
    const results = getResults(searchResults);
    const currentRefinement = getCurrentRefinement(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    if (!results) {
      return {
        currentRefinement,
        hits: [],
      };
    }

    return {
      currentRefinement,
      hits: results.hits,
    };
  },

  refine(props, searchState, nextRefinement) {
    return refine(props, searchState, nextRefinement, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });
  },

  cleanUp(props, searchState) {
    return cleanUp(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });
  },

  getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setQuery(
      getCurrentRefinement(props, searchState, {
        cvi: props.contextValue,
        multiIndexContext: props.indexContextValue,
      })
    );
  },

  searchForQuerySuggestions(props, searchState, nextRefinement) {
    return {
      query: nextRefinement,
      queryType: props.queryType,
      perPage: props.perPage,
      highlightPreTag: props.highlightPreTag,
      highlightPostTag: props.highlightPostTag,
      facetFilters: props.facetFilters,
    };
  },
});
