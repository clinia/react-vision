import PropTypes from 'prop-types';
import createConnector from '../core/createConnector';
import {
  cleanUpValue,
  refineValue,
  getCurrentRefinementValue,
} from '../core/indexUtils';

const getId = () => 'query';

function getCurrentRefinement(props, searchState, context) {
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
}

function refine(props, searchState, nextRefinement, context) {
  const id = getId();
  const nextValue = { [id]: nextRefinement };
  const resetPage = true;
  return refineValue(searchState, nextValue, context, resetPage);
}

function cleanUp(props, searchState, context) {
  return cleanUpValue(searchState, context, getId());
}

function getResults(searchForSuggestionsResults) {
  if (
    searchForSuggestionsResults &&
    searchForSuggestionsResults.results &&
    searchForSuggestionsResults.results.suggestions
  ) {
    return searchForSuggestionsResults.results;
  }

  return null;
}

/**
 * connectAutoComplete connector provides the logic to build a widget that will
 * let the user search for a query
 * @name connectAutoComplete
 * @kind connector
 * @propType {string} [defaultRefinement] - Provide a default value for the query
 * @providedPropType {function} refine - a function to change the current query
 * @providedPropType {function} searchForSuggestions - a function to search for suggestions
 * @providedPropType {string} currentRefinement - the current query used
 * @providedPropType {array} suggestions - the current suggestions
 */
export default createConnector({
  displayName: 'CliniaAutoComplete',

  propTypes: {
    defaultRefinement: PropTypes.string,
  },

  getProvidedProps(
    props,
    searchState,
    searchResults,
    _meta,
    searchForSuggestionsResults
  ) {
    const results = getResults(searchForSuggestionsResults);
    const currentRefinement = getCurrentRefinement(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    if (!results) {
      return {
        currentRefinement,
        suggestions: [],
        isSearchStalled: searchResults.isSearchStalled,
      };
    }

    return {
      currentRefinement,
      suggestions: results.suggestions,
      isSearchStalled: searchResults.isSearchStalled,
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

  searchForSuggestions(props, searchState, nextRefinement) {
    const params = {
      query: nextRefinement,
    };

    if (props.highlightPreTag) params.highlightPreTag = props.highlightPreTag;
    if (props.highlightPostTag)
      params.highlightPostTag = props.highlightPostTag;
    if (props.size) params.country = props.size;

    return params;
  },
});
