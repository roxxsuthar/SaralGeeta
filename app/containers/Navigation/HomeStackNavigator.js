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
        animation: 'slide_from_right',
        animationEnabled: true,
        presentation: 'card',
        cardOverlayEnabled: false,
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
          gestureEnabled: false,
          animationEnabled: true,
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
