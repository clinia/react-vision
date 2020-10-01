import React from 'react';
import { Index } from '@clinia/react-vizion-native';

import Content from '../components/Content';
import MapView from '../components/MapView';

class Map extends React.Component {
  static navigationOptions = {
    title: 'Search as you move',
  };

  render() {
    return (
      <Content>
        <Index indexName="health_facility">
          <MapView />
        </Index>
      </Content>
    );
  }
}

export default Map;
