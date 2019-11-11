import React from 'react';
import { connect } from 'react-redux';

import Content from '../components/Content';
import Hits from '../components/Hits';
import SearchBox from '../components/SearchBox';
import { setIsSearching } from '../redux/actions';

class List extends React.Component {
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
        <Hits />
      </Content>
    );
  }
}

export default connect(
  null,
  { setIsSearching }
)(List);
