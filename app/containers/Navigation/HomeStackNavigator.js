import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Navigation } from '../../constants/constants';
import Home from '../Home';
import Chapters from '../Chapters';
import Shloks from '../Shloks';
import LearnGeeta from '../LearnGeeta';

const HomeStack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      initialRouteName={Navigation.Home}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'default',
        animationEnabled: true,
        presentation: 'card',
        detachPreviousScreen: true,
      }}
    >
      <HomeStack.Screen
        name={Navigation.Home}
        component={Home}
        options={{
          animationEnabled: false,
        }}
      />
      <HomeStack.Screen name={Navigation.Chapters} component={Chapters} />
      <HomeStack.Screen name={Navigation.Shloks} component={Shloks} />
      <HomeStack.Screen
        name={Navigation.LearnGeeta}
        component={LearnGeeta}
        options={{
          gestureEnabled: true,
          animationEnabled: true,
          animation: 'fade',
          animationDuration: 200,
          fullScreenGestureEnabled: true,
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
