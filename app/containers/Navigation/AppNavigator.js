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
import PrivacyPolicy from '../PrivacyPolicy';
import TermsOfUse from '../TermsOfUse';
import Instruction from '../Instruction';
// import Splash from '../Splash';

const AppStack = createStackNavigator();

const AuthNavigator = ({ currentLanguage }) => (
  <>
    <StatusBar backgroundColor={COLORS.transparent} barStyle="dark-content" />
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
      initialRouteName={Navigation.OnboardingOne}
    >
      {/* Always show onboarding screens */}
      {/* <AppStack.Screen
        name={Navigation.Splash}
        component={Splash}
        options={{
          headerShown: false,
        }}
        initialParams={{ currentLanguage }}
      /> */}
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
      <AppStack.Screen
        name={Navigation.PrivacyPolicy}
        component={PrivacyPolicy}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={Navigation.TermsOfUse}
        component={TermsOfUse}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={Navigation.Instructions}
        component={Instruction}
        options={{
          headerShown: false,
        }}
      />
    </AppStack.Navigator>
  </>
);

AuthNavigator.propTypes = {
  ...AuthNavigator,
};

export default AuthNavigator;
