import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { IMAGES } from '../../../constants';
import styles from '../styles';

const ControlButtons = ({
  shlokIndex,
  shloks,
  getPreviousShlok,
  playAgain,
  getNextShlok,
}) => {
  const canGoPrevious = shlokIndex > 0;
  const canGoNext = shlokIndex + 1 < (shloks?.data?.length || 0);

  return (
    <View style={styles.controlContainer}>
      <TouchableOpacity
        style={styles.controlButtonStyle}
        onPress={canGoPrevious ? getPreviousShlok : null}
        activeOpacity={0.8}
      >
        {canGoPrevious && (
          <View style={styles.controlIconStyle}>
            <IMAGES.WhiteLeftArrowIcon height="100%" width="100%" />
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controlButtonStyle1}
        onPress={playAgain}
        activeOpacity={0.8}
      >
        <View style={styles.controlIconStyle}>
          <IMAGES.ReplayButton height="100%" width="100%" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controlButtonStyle}
        onPress={canGoNext ? getNextShlok : null}
        activeOpacity={0.8}
      >
        {canGoNext && (
          <View style={styles.controlIconStyle}>
            <IMAGES.WhiteRightArrowIcon height="100%" width="100%" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

ControlButtons.propTypes = {
  shlokIndex: PropTypes.number,
  shloks: PropTypes.object,
  getPreviousShlok: PropTypes.func,
  playAgain: PropTypes.func,
  getNextShlok: PropTypes.func,
};

export default ControlButtons;
