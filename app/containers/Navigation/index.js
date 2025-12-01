/**
 *
 * Navigation
 *
 */

import React, { memo, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import SplashScreen from 'react-native-splash-screen';
import { compose } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef, isReadyRef } from './RootNavigator';
import MainNavigatorWithBackAndAppState from './MainNavigator';
import {
  makeSelectAppLanguage,
  makeSelectOnboardingVisited,
  makeSelectToken,
  makeSelectUser,
} from '../App/selectors';

import makeSelectNavigation from './selectors';
import { getProfile } from '../Profile/actions';
import strings from '../../../i18n';
import { setLanguage } from '../App/actions';

export function Navigation({
  navigation,
  language,
  onboarding,
  token,
  user,
  handleGetProfile,
  _handleSetLanguage,
}) {
  const { isLanguageSelected, currentLanguage } = language;
  const { isOnboardingVisited } = onboarding;

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);

  useEffect(() => {
    if (user) {
      handleGetProfile();
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.language) {
      strings.setLanguage(user?.language);
      _handleSetLanguage(user?.language);
    }
  }, [user?.language]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      onStateChange={() => {}}
    >
      <MainNavigatorWithBackAndAppState
        currentLanguage={currentLanguage}
        isLanguageSelected={isLanguageSelected}
        navigation={navigation}
        isOnboardingVisited={isOnboardingVisited}
        token={token}
        user={user}
      />
    </NavigationContainer>
  );
}

Navigation.propTypes = {
  ...Navigation,
};

const mapStateToProps = createStructuredSelector({
  navigation: makeSelectNavigation(),
  language: makeSelectAppLanguage(),
  onboarding: makeSelectOnboardingVisited(),
  token: makeSelectToken(),
  user: makeSelectUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleGetProfile: () => dispatch(getProfile()),
    _handleSetLanguage: (payload) => dispatch(setLanguage(payload)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Navigation);
