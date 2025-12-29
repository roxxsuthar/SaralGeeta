import React, { useEffect, useCallback } from 'react';
import { Alert, BackHandler } from 'react-native';

import { navigationRef } from '../containers/Navigation/RootNavigator';
import { Navigation } from '../constants/constants';

const withBack = (WrappedComponent) => {
  const ScreenWithBack = (props) => {
    const onBack = useCallback(() => {
      const navigation = navigationRef.current;
      if (!navigation) return false;

      const currentRoute = navigation.getCurrentRoute();
      const currentRouteName = currentRoute?.name;

      // Handle special cases for certain screens
      switch (currentRouteName) {
        case Navigation.Home:
          // Show exit confirmation dialog on Home screen
          Alert.alert('Exit', 'Are you sure you want to exit?', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => BackHandler.exitApp(),
            },
          ]);
          return true;

        case Navigation.LearnGeeta:
        case Navigation.Shloks:
        case Navigation.Chapters:
          // For screens in HomeStack, let React Navigation handle it
          // Return false to not intercept the back button
          if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
          }
          return false;

        case Navigation.OtpScreen:
        case Navigation.Login:
          // For auth screens
          if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
          }
          return false;

        case Navigation.Profile:
        case Navigation.EditProfile:
        case Navigation.PrivacyPolicy:
        case Navigation.TermsOfUse:
        case Navigation.ContactUs:
          // For drawer screens, navigate to HomeStack
          navigation.navigate('HomeStack', { screen: Navigation.Home });
          return true;

        default:
          // For other screens, try going back if possible
          if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
          }
          return false;
      }
    }, []);

    useEffect(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBack,
      );
      return () => {
        try {
          subscription.remove();
        } catch {
          /* empty */
        }
      };
    }, [onBack]);

    return <WrappedComponent {...props} />;
  };

  return ScreenWithBack;
};

export default withBack;
