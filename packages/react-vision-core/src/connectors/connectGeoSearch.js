import { objectHasKeys } from '../core/utils';
import createConnector from '../core/createConnector';
import {
  getResults,
  getCurrentRefinementValue,
  getIndexId,
  refineValue,
  cleanUpValue,
} from '../core/indexUtils';

/**
 * The GeoSearch connector provides the logic to build a widget that will display the results on a map.
 * It also provides a way to search for results based on their position.
 * @name connectGeoSearch
 * @kind connector
 * @requirements Note that the GeoSearch connector uses the geosearch capabilities of Google Maps
 * Your records **must** have a `geoPoint` attribute in order to be passed to the rendering function.
 * @propType {{ northEast: { lat: number, lng: number }, southWest: {lat: number, lng:number } }} [defaultRefinement] - Default search state of the widget containing the bounds for the map
 * @providedPropType {function({ northEast: { lat: number, lng: number }, southWest: {lat: number, lng:number } })} refine - a function to toggle the refinement
 * @providedPropType {function} createURL - a function to generate a URl for the corresponding search state
 * @providedPropType {boolean} isRefinedWithMap - true if the current refinement is set with the maps bounds
 * @providedPropType {{ northEast: { lat: number, lng: number }, southWest: { lat: number, lng: number } }} [currentRefinement] - the refinement currently applied
 * @providedPropType {{ lat: number, lng: number }} [position] - the position of the search
 */

const getBoundingBoxId = () => 'boundingBox';
const getAroundLatLngId = () => 'aroundLatLng';
const getConfigureAroundLatLngId = () => 'configure.aroundLatLng';

const currentRefinementToString = currentRefinement =>
  [
    currentRefinement.northEast.lat,
    currentRefinement.northEast.lng,
    currentRefinement.southWest.lat,
    currentRefinement.southWest.lng,
  ].join();

const stringToCurrentRefinement = value => {
  const values = value.split(',');

  return {
    northEast: {
      lat: parseFloat(values[0]),
      lng: parseFloat(values[1]),
    },
    southWest: {
      lat: parseFloat(values[2]),
      lng: parseFloat(values[3]),
    },
  };
};

const latLngRegExp = /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/;
const stringToPosition = value => {
  const pattern = value.match(latLngRegExp);

  return {
    lat: parseFloat(pattern[1]),
    lng: parseFloat(pattern[2]),
  };
};

const getCurrentRefinement = (props, searchState, context) => {
  const refinement = getCurrentRefinementValue(
    props,
    searchState,
    context,
    getBoundingBoxId(),
    {}
  );

  if (!objectHasKeys(refinement)) {
    return;
  }

  // eslint-disable-next-line consistent-return
  return {
    northEast: {
      lat: parseFloat(refinement.northEast.lat),
      lng: parseFloat(refinement.northEast.lng),
    },
    southWest: {
      lat: parseFloat(refinement.southWest.lat),
      lng: parseFloat(refinement.southWest.lng),
    },
  };
};

const getCurrentPosition = (props, searchState, context) => {
  const { defaultRefinement, ...propsWithoutDefaultRefinement } = props;

  const aroundLatLng = getCurrentRefinementValue(
    propsWithoutDefaultRefinement,
    searchState,
    context,
    getAroundLatLngId()
  );

  if (!aroundLatLng) {
    // Fallback on `configure.aroundLatLng`
    const configureAroundLatLng = getCurrentRefinementValue(
      propsWithoutDefaultRefinement,
      searchState,
      context,
      getConfigureAroundLatLngId()
    );

    return configureAroundLatLng && stringToPosition(configureAroundLatLng);
  }

  return aroundLatLng;
};

const refine = (searchState, nextValue, context) => {
  const resetPage = true;
  const nextRefinement = {
    [getBoundingBoxId()]: nextValue,
  };

  return refineValue(searchState, nextRefinement, context, resetPage);
};

export default createConnector({
  displayName: 'CliniaGeoSearch',

  getProvidedProps(props, searchState, searchResults) {
    const context = {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    };

    const results = getResults(searchResults, context);

    const currentRefinementFromSearchState = getCurrentRefinement(
      props,
      searchState,
      context
    );

    const currentRefinementFromSearchParameters =
      (results &&
        results._state &&
        results._state.meta &&
        results._state.meta.geo &&
        results._state.meta.geo.insideBoundingBox &&
        stringToCurrentRefinement(results._state.meta.geo.insideBoundingBox)) ||
      undefined;

    const currentPositionFromSearchState = getCurrentPosition(
      props,
      searchState,
      context
    );

    const currentPositionFromSearchParameters =
      (results &&
        results._state &&
        results._state.meta &&
        results._state.meta.geo &&
        results._state.meta.geo.aroundLatLng &&
        stringToPosition(results._state.meta.geo.aroundLatLng)) ||
      undefined;

    const currentRefinement =
      currentRefinementFromSearchState || currentRefinementFromSearchParameters;

    const position =
      currentPositionFromSearchState || currentPositionFromSearchParameters;

    return {
      records: !results ? [] : results.records.filter(_ => Boolean(_.geoPoint)),
      isRefinedWithMap: Boolean(currentRefinement),
      currentRefinement,
      position,
    };
  },

  refine(props, searchState, nextValue) {
    return refine(searchState, nextValue, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });
  },

  getSearchParameters(searchParameters, props, searchState) {
    const currentRefinement = getCurrentRefinement(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    if (!currentRefinement) {
      return searchParameters;
    }

    return searchParameters.setQueryParameter(
      'insideBoundingBox',
      currentRefinementToString(currentRefinement)
    );
  },

  cleanUp(props, searchState) {
    return cleanUpValue(
      searchState,
      {
        cvi: props.contextValue,
        multiIndexContext: props.indexContextValue,
      },
      getBoundingBoxId()
    );
  },

  getMetadata(props, searchState) {
    const items = [];
    const id = getBoundingBoxId();
    const context = {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    };
    const index = getIndexId(context);
    const nextRefinement = {};
    const currentRefinement = getCurrentRefinement(props, searchState, context);

    if (currentRefinement) {
      items.push({
        label: `${id}: ${currentRefinementToString(currentRefinement)}`,
        value: nextState => refine(nextState, nextRefinement, context),
        currentRefinement,
      });
    }

    return {
      id,
      index,
      items,
    };
  },

  shouldComponentUpdate() {
    return true;
  },
});
