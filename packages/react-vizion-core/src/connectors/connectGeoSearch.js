import { objectHasKeys, addQueryID } from '../core/utils';
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
 * @requirements Note that the GeoSearch connector uses the geosearch capabilities of Clinia
 * Your hits **must** have a `_geoPoint` property in order to be passed to the rendering function.
 * @propType {{ northEast: { lat: number, lng: number }, southWest: {lat: number, lng:number } }} [defaultRefinement] - Default search state of the widget containing the bounds for the map
 * @providedPropType {function({ northEast: { lat: number, lng: number }, southWest: {lat: number, lng:number } })} refine - a function to toggle the refinement
 * @providedPropType {function} createURL - a function to generate a URl for the corresponding search state
 * @providedPropType {array.<object>} hits - the records that matched the search
 * @providedPropType {boolean} isRefinedWithMap - true if the current refinement is set with the maps bounds
 * @providedPropType {{ northEast: { lat: number, lng: number }, southWest: { lat: number, lng: number } }} [currentRefinement] - the refinement currently applied
 * @providedPropType {{ lat: number, lng: number }} [position] - the position of the search
 */

// To control the map with an external widget the other widget
// **must** write the value in the property `aroundLatLng`
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

    // We read it from both because the SearchParameters & the searchState are not always
    // in sync. When we set the refinement the searchState is used but when we clear the refinement
    // the SearchParameters is used. In the first case when we render, the results are not there
    // so we can't find the value from the results. The most up to date value is the searchState.
    // But when we clear the refinement the searchState is immediately cleared even when the items
    // retrieved are still the one from the previous query with the bounding box. It leads to some
    // issue with the position of the map. We should rely on 1 source of truth or at least always
    // be sync.

    const currentRefinementFromSearchState = getCurrentRefinement(
      props,
      searchState,
      context
    );

    const currentRefinementFromSearchParameters =
      (results &&
        results._state &&
        results._state.insideBoundingBox &&
        stringToCurrentRefinement(results._state.insideBoundingBox)) ||
      undefined;

    const currentPositionFromSearchState = getCurrentPosition(
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

    const currentRefinement =
      currentRefinementFromSearchState || currentRefinementFromSearchParameters;

    const position =
      currentPositionFromSearchState || currentPositionFromSearchParameters;

    return {
      hits: !results
        ? []
        : addQueryID(
            results.hits.filter(_ => Boolean(_._geoPoint)),
            results.queryID
          ),
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
