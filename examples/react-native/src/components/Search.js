import React from 'react';
import { View } from 'react-native';

import { Container } from '../styles';
import AutoSuggest from './AutoSuggest';

class Search extends React.Component {
  render() {
    const { children, isSearching } = this.props;
    return (
      <View style={Container.main}>
        {isSearching ? <AutoSuggest /> : children}
      </View>
    );
  }
}

export default Search;
