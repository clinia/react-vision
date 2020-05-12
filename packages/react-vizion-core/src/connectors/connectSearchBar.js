import PropTypes from 'prop-types';
import { objectHasKeys } from '../core/utils';
import createConnector from '../core/createConnector';
import {
  getResults,
  getCurrentRefinementValue,
  cleanUpValue,
  refineValue,
} from '../core/indexUtils';

const getQueryId = () => 'query';
const getAroundLatLngId = () => 'aroundLatLng';
// const getConfigureAroundLatLngId = () => 'configure.aroundLatLng';

const currentPositionRefinementToString = currentRefinement =>
  [currentRefinement.lat, currentRefinement.lng].join();

const latLngRegExp = /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/;
const stringToPosition = value => {
  const pattern = value.match(latLngRegExp);

  return {
    lat: parseFloat(pattern[1]),
    lng: parseFloat(pattern[2]),
  };
};

const getCurrentQueryRefinement = (props, searchState, context) => {
  const queryId = getQueryId(props);
  const refinement = getCurrentRefinementValue(
    props,
    searchState,
    context,
    queryId,
    ''
  );

  if (refinement) {
    return refinement;
  }
  return '';
};

const getCurrentPositionRefinement = (props, searchState, context) => {
  const refinement = getCurrentRefinementValue(
    props,
    searchState,
    context,
    getAroundLatLngId(),
    {}
  );

  if (!objectHasKeys(refinement)) {
    return;
  }

  if (refinement) {
    // eslint-disable-next-line consistent-return
    return refinement;
  }
  // eslint-disable-next-line consistent-return
  return '';
};

const refineQuery = (props, searchState, nextRefinement, context) => {
  const id = getQueryId();
  const nextValue = { [id]: nextRefinement };
  const resetPage = true;
  return refineValue(searchState, nextValue, context, resetPage);
};

const refinePosition = (props, searchState, nextValue, context) => {
  const resetPage = true;
  const nextRefinement = {
    [getAroundLatLngId()]: nextValue,
  };

  return refineValue(searchState, nextRefinement, context, resetPage);
};

const cleanUp = (props, searchState, context) => {
  const state = cleanUpValue(searchState, context, getQueryId());
  return cleanUpValue(state, context, getAroundLatLngId());
};

const getQuerySuggestionsResults = searchResults => {
  if (searchResults && searchResults.resultsQuerySuggestions) {
    return searchResults.resultsQuerySuggestions;
  }

  return null;
};

const getLocationsResults = searchResults => {
  if (searchResults && searchResults.resultsLocations) {
    return searchResults.resultsLocations;
  }

  return null;
};

/**
 * connectSearchBar connector provides the logic to build a widget that will
 * let the user search for a query and location inside the same component
 * @name connectSearchBar
 * @kind connector
 * @propType {string} [defaultQueryRefinement] - Provide a default value for the query
 * @propType {object} [defaultPositionRefinement] - Provide a default value for the position
 * @providedPropType {function} refine - a function to change the current query or/and position
 * @providedPropType {function} searchForQuerySuggestions - a function to search for query suggestions
 * @providedPropType {function} searchForLocations - a function to search for locations
 * @providedPropType {string} queryCurrentRefinement - the current query used
 * @providedPropType {array} querySuggestionHits - the current query suggestions
 * @providedPropType {array} locationHits - the current locations
 */
export default createConnector({
  displayName: 'CliniaSearchBar',

  propTypes: {
    querySuggestionsProps: PropTypes.shape({
      defaultQueryRefinement: PropTypes.string,
      queryType: PropTypes.string,
      perPage: PropTypes.number,
      highlightPreTag: PropTypes.string,
      highlightPostTag: PropTypes.string,
      facetFilters: PropTypes.array,
    }),
    geocoderProps: PropTypes.shape({
      types: PropTypes.arrayOf(PropTypes.string),
      country: PropTypes.arrayOf(PropTypes.string),
      locale: PropTypes.string,
      perPage: PropTypes.number,
    }),
  },

  defaultProps: {
    querySuggestionsProps: {
      queryType: 'prefix_last',
      perPage: 5,
      highlightPreTag: `<cvi-highlight-0000000000>`,
      highlightPostTag: `</cvi-highlight-0000000000>`,
      facetFilters: [],
    },
    geocoderProps: {
      types: [],
      country: [],
      perPage: 5,
    },
  },

  getProvidedProps(props, searchState, searchResults, _meta) {
    const context = {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    };

    const results = getResults(searchResults, context);

    const resultsQuerySuggestions = getQuerySuggestionsResults(searchResults);
    const queryCurrentRefinement = getCurrentQueryRefinement(
      props,
      searchState,
      context
    );

    // We read it from both because the SearchParameters & the searchState are not always
    // in sync. When we set the refinement the searchState is used but when we clear the refinement
    // the SearchParameters is used. In the first case when we render, the results are not there
    // so we can't find the value from the results. The most up to date value is the searchState.
    // But when we clear the refinement the searchState is immediately cleared even when the items
    // retrieved are still the one from the previous query with the bounding box. It leads to some
    // issue with the position of the map. We should rely on 1 source of truth or at least always
    // be sync.

    const resultsLocations = getLocationsResults(searchResults);
    const currentPositionRefinementFromSearchState = getCurrentPositionRefinement(
      props,
      searchState,
      context
    );

    const currentPositionFromSearchParameters =
      (results &&
        results._state &&
        results._state.aroundLatLng &&
        stringToPosition(results._state.aroundLatLng)) ||
      undefined;

    const currentPositionRefinement =
      currentPositionRefinementFromSearchState ||
      currentPositionFromSearchParameters ||
      null;

    let querySuggestionHits = [];
    if (resultsQuerySuggestions) {
      querySuggestionHits = resultsQuerySuggestions.hits || [];
    }

    let locationHits = [];
    if (resultsLocations) {
      locationHits = resultsLocations || [];
    }

    const providedProps = {
      queryCurrentRefinement,
      querySuggestionHits,
      currentPositionRefinement,
      locationHits,
    };

    return providedProps;
  },

  refine(props, searchState, nextRefinement) {
    if (!nextRefinement) {
      let state = refineQuery(props, searchState, undefined, {
        cvi: props.contextValue,
        multiIndexContext: props.indexContextValue,
      });

      state = refinePosition(props, state, undefined, {
        cvi: props.contextValue,
        multiIndexContext: props.indexContextValue,
      });

      return state;
    }

    const { query, aroundLatLng } = nextRefinement;

    let state = refineQuery(props, searchState, query || undefined, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    state = refinePosition(props, state, aroundLatLng || undefined, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    return state;
  },

  cleanUp(props, searchState) {
    return cleanUp(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });
  },

  getSearchParameters(searchParameters, props, searchState) {
    const context = {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    };

    const queryRefinement = getCurrentQueryRefinement(
      props,
      searchState,
      context
    );

    const positionRefinement = getCurrentPositionRefinement(
      props,
      searchState,
      context
    );

    if (queryRefinement) {
      searchParameters = searchParameters.setQuery(queryRefinement);
    }

    if (positionRefinement) {
      searchParameters = searchParameters
        .setQueryParameter('insideBoundingBox')
        .setQueryParameter(
          'aroundLatLng',
          currentPositionRefinementToString(positionRefinement)
        );
    }

    return searchParameters;
  },

  searchForQuerySuggestions(props, searchState, nextRefinement) {
    let params = {
      query: nextRefinement,
    };

    if (props.querySuggestionsProps) {
      params = {
        ...params,
        queryType: props.querySuggestionsProps.queryType,
        perPage: props.querySuggestionsProps.perPage,
        highlightPreTag: props.querySuggestionsProps.highlightPreTag,
        highlightPostTag: props.querySuggestionsProps.highlightPostTag,
        facetFilters: props.querySuggestionsProps.facetFilters,
      };
    }

    return params;
  },

  searchForLocations(props, _searchState, nextRefinment) {
    let params = {
      query: nextRefinment,
    };

    if (props.locationProps) {
      params = {
        ...params,
        types: props.locationProps.types,
        country: props.country,
        size: props.perPage,
      };
    }

    return params;
  },
});
