import MapView, { Marker } from 'react-native-maps';
import React from 'react';
import { connectHits } from 'react-vision-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import { Container } from '../styles';

class Map extends React.Component {
  state = {
    showUserLocation: false,
    currentLocation: undefined,
    hasAskedForLocationPermission: false,
  };

  componentDidMount() {
    this.getLocationAsync();
  }

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    let location = undefined;
    if (status === 'granted') {
      location = await Location.getCurrentPositionAsync();
    }

    this.setState({
      showUserLocation: status === 'granted',
      currentLocation: location &&
        location.coords && {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      hasAskedForLocationPermission: true,
    });
  };

  render() {
    const { records } = this.props;
    const {
      hasAskedForLocationPermission,
      showUserLocation,
      currentLocation,
    } = this.state;

    // Default region is the city of Montreal QC, Canada.
    const region = {
      latitude: 45.53,
      longitude: -73.56,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    };

    if (currentLocation) {
      region.latitude = currentLocation.latitude;
      region.longitude = currentLocation.longitude;
    }

    return (
      hasAskedForLocationPermission && (
        // We need to explicitly set the MapView size so it fills its container size.
        <MapView
          style={Container.content}
          initialRegion={region}
          showsUserLocation={showUserLocation}
        >
          {records.map(record => {
            const { geoPoint } = record;
            return (
              <Marker
                id={record.id}
                key={record.id}
                coordinate={{ latitude: geoPoint.lat, longitude: geoPoint.lng }}
                title={record.name}
                image={require('../../assets/pin.png')}
              />
            );
          })}
        </MapView>
      )
    );
  }
}

export default connectHits(Map);
