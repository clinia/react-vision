import React from 'react';
import { Image, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import cliniasearch from 'cliniasearch/lite';
import { Vision } from 'react-vision-native';
import { Provider } from 'react-redux';

import store from './src/redux/store';
import HealthFacilities from './src/pages/HealthFacilities';
import Map from './src/pages/Map';
import { Color } from './src/styles';

const searchClient = cliniasearch(
  'demo-pharamcies',
  'KcLxBhVFP8ooPgQODlAxWqfNg657fTz9'
);

// const ProfessionalsNavigation = createStackNavigator({
//   Professionals,
// });

const HealthFacilitiesNavigation = createStackNavigator({
  HealthFacilities,
});

const MapNavigation = createStackNavigator({
  Map,
});

const TabNavigator = createBottomTabNavigator(
  {
    HealthFacilities: HealthFacilitiesNavigation,
    // Professionals: ProfessionalsNavigation,
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
    // This is necessary in order for the `Vision` component to interpret the `Index` present on each tabs.
    // If rendering is lazy, problems may arise where the internal state of the `Vision` component does not reflect the structure found in the code.
    lazy: false,
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
