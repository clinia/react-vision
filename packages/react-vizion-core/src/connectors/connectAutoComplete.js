import createConnector from '../core/createConnector';
import {
  cleanUpValue,
  refineValue,
  getCurrentRefinementValue,
} from '../core/indexUtils';
import { addQueryId, addAbsolutePositions } from '../core/utils';

const getId = () => 'query';

function getCurrentRefinement(props, searchState, context) {
  const id = getId();
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

function getHits(searchResults) {
  if (searchResults.results) {
    if (
      searchResults.results.hits &&
      Array.isArray(searchResults.results.hits)
    ) {
      return addAbsolutePositions(
        addQueryId(searchResults.results.hits, searchResults.results.queryId),
        searchResults.results.perPage,
        searchResults.results.page
      );
    } else {
      return Object.keys(searchResults.results).reduce(
        (hits, index) => [
          ...hits,
          {
            index,
            hits: addAbsolutePositions(
              addQueryId(
                searchResults.results[index].hits,
                searchResults.results[index].queryId
              ),
              searchResults.results[index].perPage,
              searchResults.results[index].page
            ),
          },
        ],
        []
      );
    }
  } else {
    return [];
  }
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

/**
 * connectAutoComplete connector provides the logic to create connected
 * components that will render the results retrieved from
 * Clinia.
 *
 * To configure the number of hits retrieved, use PerPage widget,
 * connectPerPage connector or pass the perPage
 * prop to a Configure widget.
 * @name connectAutoComplete
 * @kind connector
 * @propType {string} [defaultRefinement] - Provide a default value for the query
 * @providedPropType {array.<object>} hits - the records that matched the search state
 * @providedPropType {function} refine - a function to change the query
 * @providedPropType {string} currentRefinement - the query to search for
 */
export default createConnector({
  displayName: 'CliniaAutoComplete',

  getProvidedProps(props, searchState, searchResults) {
    return {
      hits: getHits(searchResults),
      currentRefinement: getCurrentRefinement(props, searchState, {
        cvi: props.contextValue,
        multiIndexContext: props.indexContextValue,
      }),
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

  /**
   * AutoComplete needs to be considered as a widget to trigger a search,
   * even if no other widgets are used.
   *
   * To be considered as a widget you need either:
   * - getSearchParameters
   * - getMetadata
   * - transitionState
   *
   * See: createConnector.tsx
   */
  getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setQuery(
      getCurrentRefinement(props, searchState, {
        cvi: props.contextValue,
        multiIndexContext: props.indexContextValue,
      })
    );
  },
});
