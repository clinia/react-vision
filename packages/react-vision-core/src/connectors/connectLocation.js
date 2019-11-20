import PropTypes from 'prop-types';
import createConnector from '../core/createConnector';
import {
  cleanUpValue,
  refineValue,
  getCurrentRefinementValue,
} from '../core/indexUtils';

const getLocationId = () => 'location';
const getAroundLatLngId = () => 'aroundLatLng';

const currentRefinementToString = currentRefinement =>
  [currentRefinement.lat, currentRefinement.lng].join();

const getCurrentRefinement = (props, searchState, context) => {
  const id = getLocationId(props);
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

const isAroundLatLng = nextRefinement => {
  return typeof nextRefinement === 'object';
};

const getId = nextRefinement => {
  return isAroundLatLng(nextRefinement) ? getAroundLatLngId() : getLocationId();
};

const refine = (props, searchState, nextRefinement, context) => {
  const id = getId(nextRefinement);
  const nextValue = { [id]: nextRefinement };
  const resetPage = true;

  if (isAroundLatLng(nextRefinement)) {
    return {
      ...refineValue(searchState, nextValue, context, resetPage),
      location: undefined,
      boudingBox: undefined,
    };
  }

  return {
    ...refineValue(searchState, nextValue, context, resetPage),
    aroundLatLng: undefined,
    boudingBox: undefined,
  };
};

const cleanUp = (props, searchState, context) => {
  return cleanUpValue(searchState, context, getId());
};

const getResults = searchForLocationsResults => {
  if (
    searchForLocationsResults &&
    searchForLocationsResults.results &&
    searchForLocationsResults.results.suggestions
  ) {
    return searchForLocationsResults.results;
  }

  return null;
};

/**
 * connectLocation connector provides the logic to build a widget that will
 * let the user search for locations
 * @name connectLocation
 * @kind connector
 * @propType {string} [defaultRefinement] - Provide a default value for the aroundLatLng
 * @providedPropType {function} refine - a function to change the current aroundLatLng or location
 * @providedPropType {function} searchForLocations - a function to search for locations
 * @providedPropType {string} currentRefinement - the current query used
 * @providedPropType {array} suggestions - the locations
 */
export default createConnector({
  displayName: 'CliniaLocation',

  propTypes: {
    types: PropTypes.arrayOf(PropTypes.string),
    country: PropTypes.arrayOf(PropTypes.string),
    locale: PropTypes.string,
    limit: PropTypes.number,
  },

  // eslint-disable-next-line max-params
  getProvidedProps(
    props,
    searchState,
    _searchResults,
    _meta,
    _searchForSuggestionsResults,
    searchForLocationsResults
  ) {
    const results = getResults(searchForLocationsResults);
    const currentRefinement = getCurrentRefinement(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    if (!results) {
      return {
        currentRefinement,
        suggestions: [],
      };
    }

    return {
      currentRefinement,
      suggestions: results.suggestions,
    };
  },

  refine(props, searchState, nextValue) {
    return refine(props, searchState, nextValue, {
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
    if (searchState.aroundLatLng || isAroundLatLng(props.defaultRefinement)) {
      const currentRefinement =
        searchState.aroundLatLng || props.defaultRefinement;

      return searchParameters
        .setQueryParameter('insideBoundingBox')
        .setQueryParameter('location')
        .setQueryParameter(
          'aroundLatLng',
          currentRefinementToString(currentRefinement)
        )
        .setQueryParameter('country', props.country)
        .setQueryParameter('types', props.types);
    }

    const currentRefinement = searchState.location || props.defaultRefinement;

    return searchParameters
      .setQueryParameter('insideBoundingBox')
      .setQueryParameter('aroundLatLng')
      .setQueryParameter('location', currentRefinement)
      .setQueryParameter('country', props.country)
      .setQueryParameter('types', props.types);
  },

  searchForLocations(props, searchState, nextRefinment) {
    const params = {
      query: nextRefinment,
    };

    if (props.country) {
      if (Array.isArray(props.country)) {
        // Filters empty values and joins them into a valid query param value format
        params.country = props.country.filter(c => c).join(',');
      } else {
        params.country = props.country;
      }
    }
    if (props.size) params.limt = props.size;
    if (props.locale) params.locale = props.locale;

    return params;
  },

  getMetadata(props, _searchState) {
    const id = getId(props);
    return {
      id,
    };
  },
});
