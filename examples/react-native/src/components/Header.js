import * as React from 'react';
import { View } from 'react-native';

import SearchBox from './SearchBox';
import LocationBox from './LocationBox';
import { Container } from '../styles';

class Header extends React.Component {
  render() {
    return (
      <View style={Container.content}>
        <SearchBox />
        <LocationBox />
      </View>
    );
  }
}

export default Header;
