import React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../../constants';
import { Navigation } from '../../constants/constants';
import OnboardingOne from '../OnboardingOne';
import OnboardingSecond from '../OnboardingSecond';
import Language from '../Language';
import Login from '../Login';
import OtpScreen from '../OtpScreen';
import DashboardNavigator from './DashboardNavigator';

const AppStack = createStackNavigator();

const AuthNavigator = ({
  currentLanguage,
  isLanguageSelected,
  isOnboardingVisited,
  token,
}) => {
  // Determine which screen to show based on app state
  // If not visited onboarding, show onboarding
  if (!isOnboardingVisited) {
    return (
      <>
        <StatusBar
          backgroundColor={COLORS.transparent}
          barStyle="dark-content"
        />
        <AppStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={Navigation.OnboardingOne}
        >
          <AppStack.Screen
            name={Navigation.OnboardingOne}
            component={OnboardingOne}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name={Navigation.OnboardingSecond}
            component={OnboardingSecond}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name={Navigation.Language}
            component={Language}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name={Navigation.Login}
            component={Login}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name={Navigation.OtpScreen}
            component={OtpScreen}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name="DashboardNavigator"
            component={DashboardNavigator}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
        </AppStack.Navigator>
      </>
    );
  }

  // If language not selected, show language selection
  if (!isLanguageSelected) {
    return (
      <>
        <StatusBar
          backgroundColor={COLORS.transparent}
          barStyle="dark-content"
        />
        <AppStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={Navigation.Language}
        >
          <AppStack.Screen
            name={Navigation.OnboardingOne}
            component={OnboardingOne}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name={Navigation.OnboardingSecond}
            component={OnboardingSecond}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name={Navigation.Language}
            component={Language}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name={Navigation.Login}
            component={Login}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name={Navigation.OtpScreen}
            component={OtpScreen}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name="DashboardNavigator"
            component={DashboardNavigator}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
        </AppStack.Navigator>
      </>
    );
  }

  // If no token (not logged in), show login
  if (!token) {
    return (
      <>
        <StatusBar
          backgroundColor={COLORS.transparent}
          barStyle="dark-content"
        />
        <AppStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={Navigation.Login}
        >
          <AppStack.Screen
            name={Navigation.OnboardingOne}
            component={OnboardingOne}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name={Navigation.OnboardingSecond}
            component={OnboardingSecond}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name={Navigation.Language}
            component={Language}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name={Navigation.Login}
            component={Login}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name={Navigation.OtpScreen}
            component={OtpScreen}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
          <AppStack.Screen
            name="DashboardNavigator"
            component={DashboardNavigator}
            options={{ headerShown: false }}
            initialParams={{ currentLanguage }}
          />
        </AppStack.Navigator>
      </>
    );
  }

  // Logged in, show home/dashboard
  return (
    <>
      <StatusBar
        backgroundColor={COLORS.transparent}
        barStyle="dark-content"
      />
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="DashboardNavigator"
      >
        {/* Onboarding screens - always available */}
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

        {/* Login and OTP screens */}
        <AppStack.Screen
          name={Navigation.Login}
          component={Login}
          options={{
            headerShown: false,
          }}
          initialParams={{ currentLanguage }}
        />
        <AppStack.Screen
          name={Navigation.OtpScreen}
          component={OtpScreen}
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
