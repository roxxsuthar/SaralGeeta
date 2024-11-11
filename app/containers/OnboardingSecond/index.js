/**
 *
 * OnboardingSecond
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import makeSelectOnboardingSecond from './selectors';
import styles from './styles';

function OnboardingSecond() {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  );
}

OnboardingSecond.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  onboardingSecond: makeSelectOnboardingSecond(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(OnboardingSecond);
