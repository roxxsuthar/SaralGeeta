/**
 *
 * FastImageLoading
 *
 */

import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
// import isNull from 'lodash/isNull';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';

import { COLORS } from '../../constants';
import baseStyle from './styles';
import { modifyUrl } from '../../utils/modifyImageUrl';
function FastImageLoading({
  imageUrl,
  styles,
  indicatorSize,
  children,
  iconSize,
  resizeMode,
}) {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const activeLoadingHandler = useCallback(() => setLoader(true), [loader]);
  const deactivateLoadingHandler = useCallback(() => {
    setLoader(false);
    setError(false);
  }, [loader]);
  const onErrorHandler = useCallback(() => {
    setError(true);
    setLoader(false);
    //
  }, [error, loader]);

  const url = modifyUrl(imageUrl);

  const checkForLoaderIconAndIndicator = useCallback(() => {
    if (loader) {
      return (
        <View style={baseStyle.activityLoaderStyle}>
          <ActivityIndicator size={indicatorSize} color={COLORS.emoRed} />
        </View>
      );
    }
    if (isNil(imageUrl)) {
      return (
        <View style={baseStyle.iconContainer}>
          <Icon name="image" color={COLORS.emoRed} size={iconSize} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={baseStyle.iconContainer}>
          <Icon
            name="exclamation-triangle"
            color={COLORS.emoRed}
            size={iconSize}
          />
        </View>
      );
    }
    return null;
  }, [loader, error, imageUrl]);

  return (
    <FastImage
      style={styles}
      source={{
        uri: url,
        priority: FastImage.priority.high,
      }}
      resizeMode={resizeMode}
      onLoadStart={activeLoadingHandler}
      onLoad={deactivateLoadingHandler}
      onError={onErrorHandler}
    >
      {checkForLoaderIconAndIndicator()}
      {children}
    </FastImage>
  );
}

FastImageLoading.propTypes = {
  imageUrl: PropTypes.string,
  styles: PropTypes.object,
  indicatorSize: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconSize: PropTypes.number,
  resizeMode: PropTypes.string,
};

FastImageLoading.defaultProps = {
  indicatorSize: 'small',
  iconSize: hp(3),
  resizeMode: FastImage.resizeMode.cover,
};
export default FastImageLoading;
