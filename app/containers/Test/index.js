/**
 *
 * Test
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, Text} from 'react-native';
import {createStructuredSelector} from 'reselect';
import {compose} from 'redux';

import makeSelectTest from './selectors';
import styles from './styles';

function Test() {

  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  );
}

Test.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  test: makeSelectTest(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Test);
