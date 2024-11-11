/**
 *
 * CustomButton
 *
 */

import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import { isEqual } from 'lodash';
import styles from './styles';
import { IMAGES } from '../../constants';
function CustomButton({
  title = 'Demo Text',
  style,
  labelStyle,
  onPress = () => null,
  disabled = false,
  disabledStyle,
  disabledLabelStyle,
  nextNavigateIcon = false,
  previousNavigateIcon,
}) {
  const buttonStyle = useCallback(() => {
    if (disabled) {
      return { ...styles.disabledContainerStyle, ...disabledStyle };
    }
    return { ...styles.defaultContainer, ...style };
  }, [disabled, style, disabledStyle]);

  const textStyle = useCallback(() => {
    if (disabled) {
      return { ...styles.disabledButtonText, ...disabledLabelStyle };
    }
    return { ...styles.defaultButtonText, ...labelStyle };
  }, [disabled, labelStyle, disabledLabelStyle]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={buttonStyle()}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.textIconContainer}>
        {isEqual(previousNavigateIcon, true) && (
          <View style={styles.previousNavigateIcon}>
            <IMAGES.BackIcon width="100%" height="100%" color="white" />
          </View>
        )}
        <Text style={textStyle()}>{title}</Text>
        {isEqual(nextNavigateIcon, true) && (
          <View style={styles.nextNavigateIcon}>
            <IMAGES.NavigateNext width="100%" height="100%" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

CustomButton.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object,
  labelStyle: PropTypes.object,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  disabledStyle: PropTypes.object,
  disabledLabelStyle: PropTypes.object,
  nextNavigateIcon: PropTypes.bool,
  previousNavigateIcon: PropTypes.bool,
};

export default memo(CustomButton);
