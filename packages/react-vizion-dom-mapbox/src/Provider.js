import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LatLngPropType, BoundingBoxPropType } from './propTypes';
import GeoSearchContext from './GeoSearchContext';
import { isValidCoordinates } from './utils';
import { getBoundingBox } from './geo';

class Provider extends Component {
  static propTypes = {
    mapboxgl: PropTypes.object.isRequired,
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    isRefineOnMapMove: PropTypes.bool.isRequired,
    hasMapMoveSinceLastRefine: PropTypes.bool.isRequired,
    isRefineEnable: PropTypes.bool.isRequired,
    refine: PropTypes.func.isRequired,
    toggleRefineOnMapMove: PropTypes.func.isRequired,
    setMapMoveSinceLastRefine: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
    position: LatLngPropType,
    refineBounds: PropTypes.bool.isRequired,
    currentRefinement: BoundingBoxPropType,
  };

  isPendingRefine = false;
  boundingBox = null;
  previousBoundingBox = null;

  refineWithInstance = instance => {
    const { refine } = this.props;

    const bounds = instance.getBounds();
    const boundsNe = bounds.getNorthEast();
    const boundsSw = bounds.getSouthWest();

    refine({
      northEast: {
        lat: boundsNe.lat,
        lng: boundsNe.lng,
      },
      southWest: {
        lat: boundsSw.lat,
        lng: boundsSw.lng,
      },
    });
  };

  mapValue = {
    isRefineOnMapMove: this.props.isRefineOnMapMove,
    hasMapMoveSinceLastRefine: this.props.hasMapMoveSinceLastRefine,
    toggleRefineOnMapMove: this.props.toggleRefineOnMapMove,
    setMapMoveSinceLastRefine: this.props.setMapMoveSinceLastRefine,
    refineWithInstance: this.refineWithInstance,
  };

  getMapValue = () => {
    const haveContextValuesChanges =
      this.mapValue.isRefineOnMapMove !== this.props.isRefineOnMapMove ||
      this.mapValue.hasMapMoveSinceLastRefine !==
        this.props.hasMapMoveSinceLastRefine;

    if (haveContextValuesChanges) {
      this.mapValue = {
        ...this.mapValue,
        isRefineOnMapMove: this.props.isRefineOnMapMove,
        hasMapMoveSinceLastRefine: this.props.hasMapMoveSinceLastRefine,
      };
    }

    return this.mapValue;
  };

  createBoundingBoxFromRecords(hits) {
    const locations = hits.reduce((acc, hit) => {
      if (Array.isArray(hit._geoPoint)) {
        const geoPoints = hit._geoPoint.filter(geoPoint =>
          isValidCoordinates(geoPoint.lat, geoPoint.lon)
        );
        acc = [...acc, ...geoPoints];
      } else if (isValidCoordinates(hit._geoPoint.lat, hit._geoPoint.lon)) {
        acc.push(hit._geoPoint);
      }

      return acc;
    }, []);
    const boundingBox = getBoundingBox(locations);

    return {
      northEast: {
        lat: boundingBox.topLeft.lat,
        lng: boundingBox.bottomRight.lon,
      },
      southWest: {
        lat: boundingBox.bottomRight.lat,
        lng: boundingBox.topLeft.lon,
      },
    };
  }

  onChange = () => {
    const {
      isRefineOnMapMove,
      isRefineEnable,
      setMapMoveSinceLastRefine,
    } = this.props;

    if (isRefineEnable) {
      setMapMoveSinceLastRefine(true);

      if (isRefineOnMapMove) {
        this.isPendingRefine = true;
      }
    }
  };

  onIdle = instance => {
    if (this.isPendingRefine) {
      this.refineWithInstance(instance);
    }
  };

  shouldUpdate = () => {
    const { hasMapMoveSinceLastRefine } = this.props;

    return !this.isPendingRefine && !hasMapMoveSinceLastRefine;
  };

  render() {
    const { hits, currentRefinement, children, refineBounds } = this.props;

    // We use this value for differentiate the padding to apply during
    // fitBounds. When we don't have a currenRefinement (boundingBox)
    // we let Mapbox compute the automatic padding. But when we
    // provide the currentRefinement we explicitly set the padding
    // to `0` otherwise the map will decrease the zoom on each refine.
    const boundingBoxPadding = !currentRefinement ? undefined : 0;
    const boundingBox =
      (!currentRefinement && Boolean(hits.length)) ||
      (refineBounds && Boolean(hits.length))
        ? this.createBoundingBoxFromRecords(hits)
        : currentRefinement;

    return (
      <GeoSearchContext.Provider value={this.getMapValue()}>
        {children({
          onChange: this.onChange,
          onIdle: this.onIdle,
          shouldUpdate: this.shouldUpdate,
          boundingBox,
          boundingBoxPadding,
        })}
      </GeoSearchContext.Provider>
    );
  }
}

export default Provider;
