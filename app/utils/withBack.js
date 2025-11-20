/* eslint-disable react/prop-types */
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
      const state = navigation.getState();

      // Check if we're in a nested navigator
      const isInNestedNavigator = state.routes.length > 1;

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

        case Navigation.LearnGeeta: {
          const drawerState =
            state.routes[0]?.state?.routes[0]?.state?.routes[0]?.state;

          // Check if Shloks route exists with params - that's where we came from
          if (drawerState) {
            const shloksRoute = drawerState.routes.find(
              (route) => route.name === 'Shloks',
            );

            if (shloksRoute && shloksRoute.params) {
              navigation.navigate('Shloks', shloksRoute.params);
              return true;
            } else {
            }
          } else {
          }

          if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
          }
          return false;
        }

        case Navigation.Shloks:
        case Navigation.Chapters:
          // For these screens, try navigating up through the stack
          try {
            if (isInNestedNavigator) {
              navigation.goBack();
              return true;
            }
          } catch {
            /* empty */
          }
          break;

        case Navigation.OtpScreen:
        case Navigation.Login:
          // For auth screens, ensure we can go back before attempting
          if (state.routes.length > 1) {
            navigation.goBack();
            return true;
          }
          break;

        default:
          // For drawer screens and others
          try {
            const isDrawerScreen = [
              Navigation.Profile,
              Navigation.EditProfile,
              Navigation.PrivacyPolicy,
              Navigation.TermsOfUse,
              Navigation.ContactUs,
            ].includes(currentRouteName);

            if (isDrawerScreen) {
              // Use replace to avoid navigation stack issues
              navigation.reset({
                index: 0,
                routes: [{ name: Navigation.Home }],
              });
              return true;
            } else if (isInNestedNavigator) {
              // For other screens in nested navigators
              navigation.goBack();
              return true;
            }
          } catch {
            /* empty */
          }
          break;
      }

      // If nothing above handled it and we can go back, do it
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }

      // Return false to let the default handler run
      return false;
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
