import MapView from 'react-native-maps';
import React from 'react';
import { connectGeoSearch } from 'react-vision-core';

import { Container } from '../styles';

// Default region is the city of Montreal QC, Canada.
const defaultRegion = {
  latitude: 45.53,
  longitude: -73.56,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

class Map extends React.Component {
  state = {
    showUserLocation: false,
    currentLocation: undefined,
    hasAskedForLocationPermission: false,
  };

  componentDidMount() {
    // Refine to default region
    this.refineRegion(defaultRegion);
  }

  onRegionChangeComplete = region => {
    this.refineRegion(region);
  };

  refineRegion = region => {
    const { refine } = this.props;
    const northEast = {
      lat: region.latitude + region.latitudeDelta / 2,
      lng: region.longitude + region.longitudeDelta / 2,
    };
    const southWest = {
      lat: region.latitude - region.latitudeDelta / 2,
      lng: region.longitude - region.longitudeDelta / 2,
    };

    refine({
      northEast,
      southWest,
    });
  };

  render() {
    const { records } = this.props;
    return (
      // We need to explicitly set the MapView size so it fills its container size.
      <MapView
        style={Container.content}
        initialRegion={defaultRegion}
        onRegionChangeComplete={this.onRegionChangeComplete}
      >
        {records.map(record => {
          const { geoPoint } = record;
          return (
            <MapView.Marker
              id={record.id}
              key={record.id}
              coordinate={{ latitude: geoPoint.lat, longitude: geoPoint.lng }}
              title={record.name}
              image={require('../../assets/pin.png')}
            />
          );
        })}
      </MapView>
    );
  }
}

export default connectGeoSearch(Map);
