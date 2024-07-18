import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Test from '../Test';

const RootAppNavigator = createStackNavigator();
function MainNavigator() {
  return (
    <RootAppNavigator.Navigator>
      <RootAppNavigator.Screen name="Test" component={Test} />
    </RootAppNavigator.Navigator>
  );
}

MainNavigator.propTypes = {
  ...MainNavigator,
};

export default MainNavigator;
