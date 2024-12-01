/** * *
EBooks
* */

import React from 'react';
// import PropTypes from 'prop-types'; import { connect } from 'react-redux';
import { View, Text } from 'react-native';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import makeSelectEBooks from './selectors';
import styles from './styles';
function EBooks() {
  return (
    <View style="{styles.container}">
      <Text>Hello</Text>
    </View>
  );
}

EBooks.propTypes = { dispatch: PropTypes.func.isRequired };

const mapStateToProps = createStructuredSelector({
  eBooks: makeSelectEBooks(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(EBooks);
