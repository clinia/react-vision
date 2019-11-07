import React from 'react';
import { Text } from 'react-native';

import Search from '../components/Search';
import { Typography } from '../styles';

class Map extends React.Component {
  render() {
    return (
      <Search>
        <Text
          style={[Typography.title, { alignSelf: 'center', marginTop: 100 }]}
        >
          Map
        </Text>
      </Search>
    );
  }
}

export default Map;
