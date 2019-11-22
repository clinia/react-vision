import MapView from 'react-native-maps';
import React from 'react';
import { connectGeoSearch } from 'react-vision-core';
import { withNavigation } from 'react-navigation';
import { compose } from 'redux';

import { deltaRegionToBoundsRegion } from '../helpers/utils';
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
    currentRegion: undefined,
  };

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('willBlur', () => {
        const { refine } = this.props;
        refine();
      }),
      this.props.navigation.addListener('willFocus', () => {
        const { currentRegion } = this.state;
        if (currentRegion) {
          this.refineRegion(currentRegion);
        }
      }),
    ];
  }

  componentWillUnmount() {
    this.subs.forEach(x => x.remove());
  }

  onRegionChangeComplete = region => {
    this.setState({ currentRegion: region });
    this.refineRegion(region);
  };

  refineRegion = region => {
    const { refine } = this.props;

    refine(deltaRegionToBoundsRegion(region));
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

export default compose(
  connectGeoSearch,
  withNavigation
)(Map);
