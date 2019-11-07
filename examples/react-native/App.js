import React from 'react';
import { View } from 'react-native';
import cliniasearch from 'cliniasearch/lite';
import { Vision } from 'react-vision-dom';

import { Container } from './src/styles';
import SearchBox from './src/components/SearchBox';
import Hits from './src/components/Hits';

const searchClient = cliniasearch('TODO', 'ClM5vDTmS4GWEL0aS7osJaRkowV8McuP', {
  hosts: {
    write: ['api.partner.staging.clinia.ca'],
    read: ['api.partner.staging.clinia.ca'],
  },
});

export default function App() {
  return (
    <Vision searchClient={searchClient} indexName="health_facility">
      <View style={Container.main}>
        <SearchBox />
        <Hits />
      </View>
    </Vision>
  );
}
