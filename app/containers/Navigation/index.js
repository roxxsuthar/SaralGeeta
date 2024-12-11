/**
 *
 * Navigation
 *
 */

import React, { memo, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
// import SplashScreen from 'react-native-splash-screen';
import { compose } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigatorWithBackAndAppState from './MainNavigator';
import {
  makeSelectAppLanguage,
  makeSelectOnboardingVisited,
  makeSelectToken,
  makeSelectUser,
} from '../App/selectors';

import makeSelectNavigation from './selectors';

export function Navigation({ navigation, language, onboarding, token, user }) {
  const { isLanguageSelected, currentLanguage } = language;
  const { isOnboardingVisited } = onboarding;

  // useEffect(() => {
  //   SplashScreen.hide(); // Hide the splash screen once the app is ready
  // }, []);

  return (
    <NavigationContainer>
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
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Navigation);
