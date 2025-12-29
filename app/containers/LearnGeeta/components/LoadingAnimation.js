import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import { IMAGES } from '../../../constants';
import styles from '../styles';

const LoadingAnimation = ({
  animationRef,
  source = IMAGES.TranslationAnimation,
}) => {
  return (
    <View style={styles.cloudAnimationContainer}>
      <Lottie
        ref={animationRef}
        source={source}
        autoPlay
        loop
        style={styles.cloudAnimation}
      />
    </View>
  );
};

LoadingAnimation.propTypes = {
  animationRef: PropTypes.object,
  source: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

export default LoadingAnimation;
