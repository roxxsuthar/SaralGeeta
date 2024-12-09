import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Navigation } from '../../constants/constants';
import OurIdeals from '../OurIdeals';
import Home from '../Home';
import Chapters from '../Chapters';
import Shloks from '../Shloks';
import LearnGeeta from '../LearnGeeta';

const DashboardStack = createStackNavigator();

const DashboardNavigator = () => (
  <DashboardStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <DashboardStack.Screen
      name={Navigation.OurIdeals}
      component={OurIdeals}
      options={{
        headerShown: false,
      }}
    />
    <DashboardStack.Screen
      name={Navigation.Home}
      component={Home}
      options={{
        headerShown: false,
      }}
    />

    <DashboardStack.Screen
      name={Navigation.Chapters}
      component={Chapters}
      options={{
        headerShown: false,
      }}
    />
    <DashboardStack.Screen
      name={Navigation.Shloks}
      component={Shloks}
      options={{
        headerShown: false,
      }}
    />
    <DashboardStack.Screen
      name={Navigation.LearnGeeta}
      component={LearnGeeta}
      options={{
        headerShown: false,
      }}
    />
  </DashboardStack.Navigator>
);

DashboardNavigator.propTypes = {
  ...DashboardNavigator,
};

export default DashboardNavigator;
