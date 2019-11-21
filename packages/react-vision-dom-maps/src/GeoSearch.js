import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LatLngPropType, BoundingBoxPropType } from './propTypes';
import Connector from './Connector';
import Provider from './Provider';
import GoogleMaps from './GoogleMaps';

/**
 * @module GeoSearch
 */

/**
 * @description Map component to display search results.
 * @alias module:GeoSearch
 * @kind widget
 * @prop {BoundingBoxPropType} defaultRefinement - The default bounds of the map.
 * @prop {boolean} enableRefine - If the refinement is enabled at all for the map.
 * @prop {boolean} enableRefineOnMapMove - If the map should trigger a new search on map movement.
 * @prop {Object} google - The google client.
 * @prop {LatLngPropType} initialPosition - The initial position of the map.
 * @prop {number} initialZoom - The initial zoom value.
 */
export default class GeoSearch extends Component {
  static propTypes = {
    google: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    initialZoom: PropTypes.number,
    initialPosition: LatLngPropType,
    enableRefine: PropTypes.bool,
    enableRefineOnMapMove: PropTypes.bool,
    defaultRefinement: BoundingBoxPropType,
  };

  static defaultProps = {
    initialZoom: 1,
    initialPosition: { lat: 0, lng: 0 },
    enableRefine: true,
    enableRefineOnMapMove: true,
    defaultRefinement: null,
  };

  renderChildrenWithBoundFunction = ({ records, position, ...rest }) => {
    const {
      google,
      children,
      initialZoom,
      initialPosition,
      enableRefine,
      enableRefineOnMapMove,
      defaultRefinement,
      ...mapOptions
    } = this.props;

    return (
      <Provider
        {...rest}
        testID="Provider"
        google={google}
        records={records}
        position={position}
        isRefineEnable={enableRefine}
      >
        {({
          boundingBox,
          boundingBoxPadding,
          onChange,
          onIdle,
          shouldUpdate,
        }) => (
          <GoogleMaps
            testID="GoogleMaps"
            google={google}
            initialZoom={initialZoom}
            initialPosition={position || initialPosition}
            mapOptions={mapOptions}
            boundingBox={boundingBox}
            boundingBoxPadding={boundingBoxPadding}
            onChange={onChange}
            onIdle={onIdle}
            shouldUpdate={shouldUpdate}
          >
            {children({ records })}
          </GoogleMaps>
        )}
      </Provider>
    );
  };

  render() {
    const { enableRefineOnMapMove, defaultRefinement } = this.props;

    return (
      <Connector
        testID="Connector"
        enableRefineOnMapMove={enableRefineOnMapMove}
        defaultRefinement={defaultRefinement}
      >
        {this.renderChildrenWithBoundFunction}
      </Connector>
    );
  }
}
