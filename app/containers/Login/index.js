/**
 *
 * Login
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import makeSelectLogin from './selectors';
import styles from './styles';

function Login() {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  );
}

Login.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  login: makeSelectLogin(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Login);
