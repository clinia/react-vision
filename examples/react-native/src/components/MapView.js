import MapView, { Marker } from 'react-native-maps';
import React from 'react';
import { View } from 'react-native';
import { connectHits } from 'react-vision-native';

import { Container } from '../styles';

class Map extends React.Component {
  render() {
    const { records } = this.props;
    return (
      <MapView style={Container.map}>
        {records.map(record => {
          const { geoPoint } = record;
          return (
            <Marker
              id={record.id}
              key={record.id}
              coordinate={{ latitude: geoPoint.lat, longitude: geoPoint.lng }}
              title={record.name}
            />
          );
        })}
      </MapView>
    );
  }
}

export default connectHits(Map);
