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
import Profile from '../Profile';
import EditProfile from '../EditProfile';
import PrivacyPolicy from '../PrivacyPolicy';
import TermsOfUse from '../TermsOfUse';
import ContactUs from '../ContactUs';
import DrawerNavigator from './DrawerNavigator';

const AppStack = createStackNavigator();

const AuthNavigator = ({
  currentLanguage,
  isOnboardingVisited,
  isLanguageSelected,
  token,
}) => (
  <>
    <StatusBar backgroundColor={COLORS.transparent} barStyle="dark-content" />
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* {!isOnboardingVisited && (
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
      {!token && (
        <>
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
        </>
      )}
      <AppStack.Screen
        name="DashboardNavigator"
        component={DashboardNavigator}
        options={{
          headerShown: false,
        }}
        initialParams={{ currentLanguage }}
      /> */}
      {/* <AppStack.Screen
        name={Navigation.Profile}
        component={Profile}
        options={{
          headerShown: false,
        }}
        initialParams={{ currentLanguage }}
      />
    </AppStack.Navigator> */}
    {/* <AppStack.Screen
        name={Navigation.EditProfile}
        component={EditProfile}
        options={{
          headerShown: false,
        }}
        initialParams={{ currentLanguage }}
      /> */}
       {/* <AppStack.Screen
        name={Navigation.PrivacyPolicy}
        component={PrivacyPolicy}
        options={{
          headerShown: false,
        }}
        initialParams={{ currentLanguage }}
      /> */}
      {/* <AppStack.Screen
        name={Navigation.TermsOfUse}
        component={TermsOfUse}
        options={{
          headerShown: false,
        }}
        initialParams={{ currentLanguage }}
      /> */}
      {/* <AppStack.Screen
        name={Navigation.ContactUs}
        component={ContactUs}
        options={{
          headerShown: false,
        }}
        initialParams={{ currentLanguage }}
      /> */}
      <AppStack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{
          headerShown: false,
        }}
        initialParams={{ currentLanguage }}
      />
    </AppStack.Navigator>
  </>
);

AuthNavigator.propTypes = {
  ...AuthNavigator,
};

export default AuthNavigator;
