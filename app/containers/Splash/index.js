/**
 *
 * Splash
 *
 */

import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { View, Image, StatusBar } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import makeSelectSplash from './selectors';
import styles from './styles';
import { IMAGES } from '../../constants';
import { Navigation } from '../../constants/constants';
import { makeSelectAppLanguage } from '../App/selectors';

function Splash({ navigation }) {
  // Set the language in strings object based on Redux state

  const navigateToSecond = useCallback(() => {
    navigation.navigate(Navigation.OnboardingOne);
  }, []);

  useEffect(() => {
    const interval = setTimeout(() => {
      navigateToSecond();
    }, 3000);
    return () => clearTimeout(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <Image
        resizeMode="cover"
        resizeMethod="auto"
        source={IMAGES.Splash}
        style={styles.imageDimensions}
      />
    </View>
  );
}

Splash.propTypes = {
  ...Splash,
};

const mapStateToProps = createStructuredSelector({
  Splash: makeSelectSplash(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Splash);
