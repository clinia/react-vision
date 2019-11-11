import React from 'react';

import Content from '../components/Content';
import Hits from '../components/Hits';
import SearchBox from '../components/SearchBox';

class List extends React.Component {
  static navigationOptions = {
    headerTitle: <SearchBox />,
  };

  render() {
    return (
      <Content>
        <Hits />
      </Content>
    );
  }
}

export default List;
