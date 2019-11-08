import React from 'react';

import Search from '../components/Search';
import SearchBox from '../components/SearchBox';
import MapView from '../components/MapView';

class Map extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <SearchBox toggleSearch={navigation.getParam('toggleSearch')} />
    ),
  });

  state = {
    isSearching: false,
  };

  componentDidMount() {
    this.props.navigation.setParams({ toggleSearch: this.toggleSearch });
  }

  toggleSearch = isSearching => {
    this.setState({ isSearching });
  };

  render() {
    return (
      <Search isSearching={this.state.isSearching}>
        <MapView />
      </Search>
    );
  }
}

export default Map;
