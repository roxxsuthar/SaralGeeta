/**
 *
 * Navigation
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigatorWithBackAndAppState from './MainNavigator';
import {
  makeSelectAppLanguage,
  makeSelectOnboardingVisited,
} from '../App/selectors';

import makeSelectNavigation from './selectors';

export function Navigation({ navigation, language, onboarding }) {
  const { isLanguageSelected, currentLanguage } = language;
  const { isOnboardingVisited } = onboarding;

  return (
    <NavigationContainer>
      <MainNavigatorWithBackAndAppState
        currentLanguage={currentLanguage}
        isLanguageSelected={isLanguageSelected}
        navigation={navigation}
        isOnboardingVisited={isOnboardingVisited}
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
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Navigation);
