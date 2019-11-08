import React from 'react';

import Search from '../components/Search';
import Hits from '../components/Hits';
import SearchBox from '../components/SearchBox';

class List extends React.Component {
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
        toggleSearch={this.toggleSearch}
      >
        <Hits />
      </Search>
    );
  }
}

export default List;
