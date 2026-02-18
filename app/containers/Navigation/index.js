/**
 *
 * Navigation
 *
 */

import React, { memo, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import RNBootSplash from 'react-native-bootsplash';
import { compose } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef, isReadyRef } from './RootNavigator';
import MainNavigatorWithBackAndAppState from './MainNavigator';
import {
  makeSelectAppLanguage,
  makeSelectOnboardingVisited,
  makeSelectToken,
  makeSelectUser,
  makeSelectIdealDetails,
} from '../App/selectors';

import makeSelectNavigation from './selectors';
import strings from '../../../i18n';
import { setLanguage } from '../App/actions';

export function Navigation({
  navigation,
  language,
  onboarding,
  token,
  user,
  idealDetails,
  _handleSetLanguage,
}) {
  const { isLanguageSelected, currentLanguage } = language;
  const { isOnboardingVisited } = onboarding;

  // Set initial language in strings object
  useEffect(() => {
    if (currentLanguage) {
      strings.setLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  useEffect(() => {
    setTimeout(() => {
      RNBootSplash.hide({ fade: true });
    }, 2000);
  }, []);


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
        idealDetails={idealDetails}
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
  idealDetails: makeSelectIdealDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    _handleSetLanguage: (payload) => dispatch(setLanguage(payload)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Navigation);
