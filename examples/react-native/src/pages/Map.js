import React from 'react';

import Content from '../components/Content';
import Header from '../components/Header';
import MapView from '../components/MapView';

class Map extends React.Component {
  static navigationOptions = {
    headerTitle: <Header />,
    headerStyle: {
      height: 80,
    },
  };

  render() {
    return (
      <Content>
        <MapView />
      </Content>
    );
  }
}

export default Map;
