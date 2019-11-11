import React from 'react';

import Content from '../components/Content';
import SearchBox from '../components/SearchBox';
import MapView from '../components/MapView';

class Map extends React.Component {
  static navigationOptions = {
    headerTitle: <SearchBox />,
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
