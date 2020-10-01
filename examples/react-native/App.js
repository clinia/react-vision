import React from 'react';
import { Image, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import clinia from 'clinia';
import { Vizion } from '@clinia/react-vizion-native';
import { Provider } from 'react-redux';

import store from './src/redux/store';
import HealthFacilities from './src/pages/HealthFacilities';
import { Color } from './src/styles';

const searchClient = clinia('<your-engine-id>', '<your-api-key>');

const HealthFacilitiesNavigation = createStackNavigator({
  HealthFacilities,
});

const TabNavigator = createBottomTabNavigator(
  {
    HealthFacilities: HealthFacilitiesNavigation,
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
          case 'HealthFacilities':
            icon = require('./assets/health_facilities.png');
            break;
          default:
            break;
        }
        return (
          <Image style={{ width: 20, height: 20, tintColor }} source={icon} />
        );
      },
      tabBarLabel: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let title;
        switch (routeName) {
          case 'HealthFacilities':
            title = 'Health Facilities';
            break;
          default:
            title = routeName;
            break;
        }
        return <Text style={{ color: tintColor }}>{title}</Text>;
      },
    }),
    tabBarOptions: {
      activeTintColor: Color.primary,
      inactiveTintColor: 'gray',
    },
    // This forces all the tabs to render immediately instead of when they are first made active.
    // This is necessary in order for the `Vizion` component to interpret the `Index` present on each tabs.
    // If rendering is lazy, problems may arise where the internal state of the `Vizion` component does not reflect the structure found in the code.
    lazy: false,
  }
);

const AppContainer = createAppContainer(TabNavigator);

export default function App() {
  return (
    <Vizion searchClient={searchClient} indexName="meta">
      <Provider store={store}>
        <AppContainer />
      </Provider>
    </Vizion>
  );
}
