/* eslint-disable react/prop-types */
import React, { useEffect, useCallback } from 'react';
import { Alert, BackHandler } from 'react-native';
import isEqual from 'lodash/isEqual';
import { navigationRef } from '../containers/Navigation/RootNavigator';
import { Navigation } from '../constants/constants';

const withBack = (WrappedComponent) => {
  const ScreenWithBack = (props) => {
    const onBack = useCallback(() => {
      const navigation = navigationRef.current;
      const currentRouteName = navigation?.getCurrentRoute()?.name;

      if (isEqual(currentRouteName, Navigation.Home1)) {
        // Show exit confirmation dialog
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
        return true; // Prevent default back behavior
      }

      if (navigation?.canGoBack()) {
        navigation.goBack(); // Navigate back
        return true; // Prevent default back behavior
      }

      // Default behavior for other cases
      return false;
    }, []);

    useEffect(() => {
      BackHandler.removeEventListener('hardwareBackPress', onBack);
      BackHandler.addEventListener('hardwareBackPress', onBack);
    }, [onBack]);

    return <WrappedComponent {...props} />;
  };

  return ScreenWithBack;
};

export default withBack;
