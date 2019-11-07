import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import cliniasearch from 'cliniasearch/lite';
import { Vision } from 'react-vision-dom';

import List from './src/pages/List';
import Map from './src/pages/Map';

const searchClient = cliniasearch('TODO', 'ClM5vDTmS4GWEL0aS7osJaRkowV8McuP', {
  hosts: {
    write: ['api.partner.staging.clinia.ca'],
    read: ['api.partner.staging.clinia.ca'],
  },
});

const TabNavigator = createBottomTabNavigator({
  List,
  Map,
});

const AppContainer = createAppContainer(TabNavigator);

export default function App() {
  return (
    <Vision searchClient={searchClient} indexName="health_facility">
      <AppContainer />
    </Vision>
  );
}
