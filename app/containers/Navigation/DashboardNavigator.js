import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Navigation } from '../../constants/constants';
import OurIdeals from '../OurIdeals';
import { useSelector } from 'react-redux';
import { makeSelectIdealDetails } from '../App/selectors';

import DrawerNavigator from './DrawerNavigator';
import isEqual from 'lodash/isEqual';

const DashboardStack = createStackNavigator();

const DashboardNavigator = () => {
  const idealDetails = useSelector(makeSelectIdealDetails());

  // Set initial route based on whether user has selected an ideal
  const initialRouteName = isEqual(idealDetails, null)
    ? Navigation.OurIdeals
    : 'Drawer';

  return (
    <DashboardStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'slide_from_right',
        animationTypeForReplace: 'pop',
        animationEnabled: true,
      }}
      initialRouteName={initialRouteName}
    >
      <DashboardStack.Screen
        name={Navigation.OurIdeals}
        component={OurIdeals}
        options={{
          headerShown: false,
        }}
      />
      <DashboardStack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
    </DashboardStack.Navigator>
  );
};

DashboardNavigator.propTypes = {
  ...DashboardNavigator,
};

export default DashboardNavigator;
