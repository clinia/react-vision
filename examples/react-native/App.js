import React from 'react';
import { Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import cliniasearch from 'cliniasearch/lite';
import { Vision } from 'react-vision-dom';

import List from './src/pages/List';
import Map from './src/pages/Map';
import { Color } from './src/styles';

const searchClient = cliniasearch('TODO', 'ClM5vDTmS4GWEL0aS7osJaRkowV8McuP', {
  hosts: {
    write: ['api.partner.staging.clinia.ca'],
    read: ['api.partner.staging.clinia.ca'],
  },
});

const ListNavigation = createStackNavigator({
  List,
});

const MapNavigation = createStackNavigator({
  Map,
});

const TabNavigator = createBottomTabNavigator(
  {
    List: ListNavigation,
    Map: MapNavigation,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let icon;
        switch (routeName) {
          case 'Map':
            icon = require('./assets/map.png');
            break;
          case 'List':
            icon = require('./assets/list.png');
            break;
          default:
            break;
        }
        return (
          <Image style={{ width: 20, height: 20, tintColor }} source={icon} />
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: Color.primary,
      inactiveTintColor: 'gray',
    },
  }
);

const AppContainer = createAppContainer(TabNavigator);

export default function App() {
  return (
    <Vision searchClient={searchClient} indexName="health_facility">
      <AppContainer />
    </Vision>
  );
}
