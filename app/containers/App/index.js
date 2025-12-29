/**
 *
 * App
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import makeSelectApp, { makeSelectToken } from './selectors';
import Root from '../Root';
import { setAxiosToken } from '../../utils/appWillMount';

function App({ token }) {
  if (token) {
    setAxiosToken(token);
  }
  return <Root />;
}

App.propTypes = {
  ...App,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
  token: makeSelectToken(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(App);
