import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { createClassNames } from '@clinia/react-vizion-dom';
import { LatLngPropType, BoundingBoxPropType } from './propTypes';
import MapboxContext from './MapboxContext';

const cx = createClassNames('geosearch');

class Mapbox extends Component {
  static propTypes = {
    mapboxgl: PropTypes.object.isRequired,
    initialZoom: PropTypes.number.isRequired,
    initialPosition: LatLngPropType.isRequired,
    mapOptions: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onIdle: PropTypes.func.isRequired,
    shouldUpdate: PropTypes.func.isRequired,
    boundingBox: BoundingBoxPropType,
    boundingBoxPadding: PropTypes.number,
    position: LatLngPropType,
    children: PropTypes.node,
  };

  isUserInteraction = true;
  isPendingRefine = false;
  listeners = [];
  mapRef = createRef();

  state = {
    isMapReady: false,
  };

  componentDidMount() {
    const { mapboxgl, mapOptions } = this.props;

    this.instance = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      ...mapOptions,
    });

    this.instance.on('load', this.setupListenersWhenMapIsReady);
    this.listeners.push('load');
  }

  componentDidUpdate() {
    const {
      mapboxgl,
      initialZoom,
      initialPosition,
      boundingBox,
      boundingBoxPadding,
      shouldUpdate,
    } = this.props;

    if (!shouldUpdate()) {
      return;
    }

    if (boundingBox) {
      this.lockUserInteration(() => {
        this.instance.fitBounds(
          new mapboxgl.LngLatBounds(
            new mapboxgl.LngLat(
              boundingBox.southWest.lng,
              boundingBox.southWest.lat
            ),
            new mapboxgl.LngLat(
              boundingBox.northEast.lng,
              boundingBox.northEast.lat
            )
          ),
          {
            padding: boundingBoxPadding ? boundingBoxPadding + 40 : 40,
          }
        );
      });
    } else {
      this.lockUserInteration(() => {
        this.instance.setZoom(initialZoom);
        this.instance.setCenter(initialPosition);
      });
    }
  }

  componentWillUnmount() {
    this.listeners.forEach(listener => {
      this.instance.off(listener);
    });

    this.listeners = [];
  }

  setupListenersWhenMapIsReady = () => {
    this.listeners = [];

    this.setState({
      isMapReady: true,
      value: {
        mapboxgl: this.props.mapboxgl,
        instance: this.instance,
      },
    });

    const onChange = () => {
      if (this.isUserInteraction) {
        this.props.onChange();
        this.props.onIdle(this.instance);
      }
    };

    this.instance.on('moveend', onChange);
    this.listeners.push('moveend');
  };

  lockUserInteration(functionThatAltersTheMapPosition) {
    this.isUserInteraction = false;
    functionThatAltersTheMapPosition();
    this.isUserInteraction = true;
  }

  render() {
    const { children } = this.props;
    const { isMapReady } = this.state;

    return (
      <div className={cx('')}>
        <div ref={this.mapRef} className={cx('map')} />
        {isMapReady && (
          <MapboxContext.Provider value={this.state.value}>
            {children}
          </MapboxContext.Provider>
        )}
      </div>
    );
  }
}

export default Mapbox;
