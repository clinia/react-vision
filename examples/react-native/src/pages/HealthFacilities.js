import React from 'react';
import { Index } from 'react-vision-native';

import Content from '../components/Content';
import Hits from '../components/Hits';
import Header from '../components/Header';

class HealthFacilities extends React.Component {
  static navigationOptions = {
    headerTitle: (
      <Index indexName="health_facility">
        <Header />
      </Index>
    ),
    headerStyle: {
      height: 80,
    },
  };

  render() {
    return (
      <Content>
        <Index indexName="health_facility">
          <Hits />
        </Index>
      </Content>
    );
  }
}

export default HealthFacilities;
