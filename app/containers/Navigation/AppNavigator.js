import React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../../constants';
import { Navigation } from '../../constants/constants';
import OnboardingOne from '../OnboardingOne';
import OnboardingSecond from '../OnboardingSecond';
import Language from '../Language';
import DashboardNavigator from './DashboardNavigator';
// import Splash from '../Splash';

const AppStack = createStackNavigator();

const AuthNavigator = ({
  currentLanguage,
  isLanguageSelected,
  idealDetails,
  isOnboardingVisited,
}) => {
  const initialRouteName = Navigation.OnboardingOne;

  return (
    <>
      <StatusBar backgroundColor={COLORS.transparent} barStyle="dark-content" />
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
        initialRouteName={initialRouteName}
      >
        <AppStack.Screen
          name={Navigation.OnboardingOne}
          component={OnboardingOne}
          options={{
            headerShown: false,
          }}
          initialParams={{ currentLanguage }}
        />
        <AppStack.Screen
          name={Navigation.OnboardingSecond}
          component={OnboardingSecond}
          options={{
            headerShown: false,
          }}
          initialParams={{ currentLanguage }}
        />

        {/* Language screen */}
        <AppStack.Screen
          name={Navigation.Language}
          component={Language}
          options={{
            headerShown: false,
          }}
          initialParams={{ currentLanguage }}
        />


        {/* Dashboard Navigator */}
        <AppStack.Screen
          name="DashboardNavigator"
          component={DashboardNavigator}
          options={{
            headerShown: false,
          }}
          initialParams={{ currentLanguage }}
        />
      </AppStack.Navigator>
    </>
  );
};

AuthNavigator.propTypes = {
  ...AuthNavigator,
};

export default AuthNavigator;
