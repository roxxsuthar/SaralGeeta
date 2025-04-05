/**
 *
 * Dashboard
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import makeSelectDashboard from './selectors';
import styles from './styles';

function Dashboard() {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  );
}

Dashboard.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  dashboard: makeSelectDashboard(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Dashboard);
