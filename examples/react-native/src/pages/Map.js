import React from 'react';
import { connect } from 'react-redux';

import Content from '../components/Content';
import SearchBox from '../components/SearchBox';
import MapView from '../components/MapView';
import { setIsSearching } from '../redux/actions';

class Map extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <SearchBox toggleSearch={navigation.getParam('toggleSearch')} />
    ),
  });

  componentDidMount() {
    this.props.navigation.setParams({
      toggleSearch: isSearching => this.props.setIsSearching(isSearching),
    });
  }

  render() {
    return (
      <Content>
        <MapView />
      </Content>
    );
  }
}

export default connect(
  null,
  { setIsSearching }
)(Map);
