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
  return (
    <DashboardStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isEqual(idealDetails, null) && (
        <DashboardStack.Screen
          name={Navigation.OurIdeals}
          component={OurIdeals}
          options={{
            headerShown: false,
          }}
        />
      )}
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
