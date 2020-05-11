import PropTypes from 'prop-types';
import createConnector from '../core/createConnector';
import {
  cleanUpValue,
  refineValue,
  getCurrentRefinementValue,
} from '../core/indexUtils';

const getId = () => 'aroundLatLng';

const currentRefinementToString = currentRefinement =>
  [currentRefinement.lat, currentRefinement.lng].join();

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
  return null;
};

const refine = (props, searchState, nextRefinement, context) => {
  const id = getId(nextRefinement);
  const nextValue = { [id]: nextRefinement };
  const resetPage = true;

  return {
    ...refineValue(searchState, nextValue, context, resetPage),
    boudingBox: undefined,
  };
};

const cleanUp = (props, searchState, context) => {
  return cleanUpValue(searchState, context, getId());
};

const getResults = searchResults => {
  if (searchResults && searchResults.resultsLocations) {
    return searchResults.resultsLocations;
  }

  return null;
};

/**
 * connectGeocoder connector provides the logic to build a widget that will
 * let the user search for locations
 * @name connectGeocoder
 * @kind connector
 * @propType {string} [defaultRefinement] - Provide a default value for the aroundLatLng
 * @providedPropType {function} refine - a function to change the current aroundLatLng
 * @providedPropType {function} searchForLocations - a function to search for locations
 * @providedPropType {string} currentRefinement - the current query used
 * @providedPropType {array} hits - the locations
 */
export default createConnector({
  displayName: 'CliniaLocation',

  propTypes: {
    types: PropTypes.arrayOf(PropTypes.string),
    country: PropTypes.arrayOf(PropTypes.string),
    locale: PropTypes.string,
    perPage: PropTypes.number,
  },

  defaultProps: {
    types: [],
    country: [],
    perPage: 5,
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
      hits: results,
    };
  },

  refine(props, searchState, nextValue) {
    const state = refine(props, searchState, nextValue, {
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
    const currentRefinement =
      searchState.aroundLatLng || props.defaultRefinement;

    if (currentRefinement) {
      return searchParameters
        .setQueryParameter('insideBoundingBox')
        .setQueryParameter(
          'aroundLatLng',
          currentRefinementToString(currentRefinement)
        );
    }

    return searchParameters;
  },

  searchForLocations(props, _searchState, nextRefinment) {
    return {
      query: nextRefinment,
      types: props.types,
      country: props.country,
      size: props.perPage,
    };
  },

  getMetadata(props, _searchState) {
    const id = getId(props);
    return {
      id,
    };
  },
});
