import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Vision } from 'react-vision-dom';
import cliniasearch from 'cliniasearch/lite';

import SearchComponent from './SearchComponent';
import HitsComponent from './HitsComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 44,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

const searchClient = cliniasearch('TODO', 'test');

export default function App() {
  return (
    <Vision searchClient={searchClient} indexName="health_facility">
      <View style={styles.container}>
        <SearchComponent />
        <HitsComponent />
      </View>
    </Vision>
  );
}
