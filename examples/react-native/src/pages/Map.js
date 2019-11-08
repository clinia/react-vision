import React from 'react';
import { Text } from 'react-native';

import Search from '../components/Search';
import SearchBox from '../components/SearchBox';
import { Typography } from '../styles';

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
      <Search
        navigation={this.props.navigation}
        isSearching={this.state.isSearching}
      >
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
