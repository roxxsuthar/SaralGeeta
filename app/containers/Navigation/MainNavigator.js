import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AppNavigator from './AppNavigator';
import withBack from '../../utils/withBack';
import withAppState from '../../utils/withAppState';

import AppStateContext from '../../components/AppStateContext';
const MainAppNavigator = createStackNavigator();

const MainNavigator = ({
  appState,
  isLanguageSelected,
  currentLanguage,
  navigation,
  isOnboardingVisited,
  token,
  user,
}) => (
  <AppStateContext.Provider value={{ appState }}>
    <MainAppNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainAppNavigator.Screen name="Auth">
        {(props) => (
          <AppNavigator
            {...props}
            isLanguageSelected={isLanguageSelected}
            currentLanguage={currentLanguage}
            navigation={navigation}
            isOnboardingVisited={isOnboardingVisited}
            token={token}
            user={user}
          />
        )}
      </MainAppNavigator.Screen>
    </MainAppNavigator.Navigator>
  </AppStateContext.Provider>
);

const MainNavigatorWithBack = withBack(MainNavigator);
const MainNavigatorWithBackAndAppState = withAppState(MainNavigatorWithBack);

MainNavigator.propTypes = {
  ...MainNavigator,
};

export default MainNavigatorWithBackAndAppState;
