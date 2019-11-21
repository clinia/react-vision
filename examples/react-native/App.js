import React from 'react';
import { Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import cliniasearch from 'cliniasearch/lite';
import { Vision } from 'react-vision-dom';
import { Provider } from 'react-redux';

import store from './src/redux/store';
import List from './src/pages/List';
import Map from './src/pages/Map';
import { Color } from './src/styles';

const searchClient = cliniasearch('TODO', 'AAW3nfvI79tj4LzECYZSEbDP7lqBpFd5', {
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
      <Provider store={store}>
        <AppContainer />
      </Provider>
    </Vision>
  );
}
