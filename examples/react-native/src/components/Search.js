import React from 'react';
import { View } from 'react-native';

import { Container } from '../styles';
import SearchBox from './SearchBox';
import AutoSuggest from './AutoSuggest';

class Search extends React.Component {
  state = {
    isSearching: false,
  };

  toggleSearch = isSearching => this.setState({ isSearching });

  render() {
    const { children } = this.props;
    const { isSearching } = this.state;
    return (
      <View style={Container.main}>
        <SearchBox toggleSearch={this.toggleSearch} />
        {isSearching ? <AutoSuggest /> : children}
      </View>
    );
  }
}

export default Search;
