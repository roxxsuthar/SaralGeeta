/**
 *
 * Navigation
 *
 */

import React, {memo} from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {createStructuredSelector} from 'reselect';
import {compose} from 'redux';
import {NavigationContainer} from '@react-navigation/native';

import makeSelectNavigation from './selectors';
import RootNavigator from './RootNavigator';

export function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

Navigation.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  navigation: makeSelectNavigation(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Navigation);
