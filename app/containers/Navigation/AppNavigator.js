import React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardNavigator from './DashboardNavigator';
import { COLORS } from '../../constants';
import { Navigation } from '../../constants/constants';
import OnboardingOne from '../OnboardingOne';
import OnboardingSecond from '../OnboardingSecond';
import Language from '../Language';

const AppStack = createStackNavigator();

const AuthNavigator = ({
  currentLanguage,
  isOnboardingVisited,
  navigation,
  isLanguageSelected,
}) => (
  <>
    <StatusBar backgroundColor={COLORS.transparent} barStyle="dark-content" />
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isOnboardingVisited && (
        <>
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
        </>
      )}
      {isOnboardingVisited && !isLanguageSelected && (
        <AppStack.Screen
          name={Navigation.Language}
          component={Language}
          options={{
            headerShown: false,
          }}
          initialParams={{ currentLanguage }}
        />
      )}
      {/* <AppStack.Screen
        name="DashboardNavigator"
        component={DashboardNavigator}
        options={{
          headerShown: false,
        }}
        initialParams={{ currentLanguage }}
      /> */}
      {/* <AppStack.Screen
        name={Navigation.OnboardingSecond}
        component={OnboardingSecond}
        options={{
          headerShown: false,
        }}
        initialParams={{ currentLanguage }}
      /> */}
    </AppStack.Navigator>
  </>
);

AuthNavigator.propTypes = {
  ...AuthNavigator,
};

export default AuthNavigator;
