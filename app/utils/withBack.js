/* eslint-disable react/prop-types */
import React, { useEffect, useCallback } from 'react';
import { Alert, BackHandler } from 'react-native';
import isEqual from 'lodash/isEqual';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '../containers/Navigation/RootNavigator';
import { Navigation } from '../constants/constants';

const withBack = (WrappedComponent) => {
  const ScreenWithBack = (props) => {
    const { handleIncreaseChatCount, currentLanguage } = props;

    const onBack = useCallback(() => {
      const navigation = navigationRef.current;
      const currentRouteName = navigation.getCurrentRoute()?.name;

      if (isEqual(currentRouteName, Navigation.Home1)) {
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
      }

      // if (navigation?.canGoBack?.() && isEqual(currentRouteName, 'Profile')) {
      //   navigation.navigate(Navigation.Home);
      //   return true;
      // }

      // if (!navigation?.canGoBack?.() && isEqual(currentRouteName, 'Profile')) {
      //   navigation?.dispatch(
      //     CommonActions?.navigate({
      //       name: Navigation.Home,
      //     }),
      //   );

      //   return true;
      // }

      if (!navigation?.canGoBack?.()) {
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
      }
      return false;
    }, [currentLanguage, navigationRef.current]);

    useEffect(() => {
      BackHandler.removeEventListener('hardwareBackPress', onBack);
      BackHandler.addEventListener('hardwareBackPress', onBack);
    }, [onBack]);

    return <WrappedComponent {...props} />;
  };

  return ScreenWithBack;
};

export default withBack;
