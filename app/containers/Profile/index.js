/** * *
Profile
* */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import makeSelectProfile from './selectors';
import styles from './styles';
function Profile() {
  return (
    <View style="{styles.container}">
      <Text>Hello</Text>
    </View>
  );
}

Profile.propTypes = { dispatch: PropTypes.func.isRequired };

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Profile);
