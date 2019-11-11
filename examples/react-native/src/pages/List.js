import React from 'react';

import Content from '../components/Content';
import Hits from '../components/Hits';
import Header from '../components/Header';

class List extends React.Component {
  static navigationOptions = {
    headerTitle: <Header />,
    headerStyle: {
      height: 80,
    },
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
