/**
 *
 * CustomText
 *
 */

import React, { memo } from 'react';

import { Text } from 'react-native';
import PropTypes from 'prop-types';

function CustomText({ children, style, numberOfLines, ...props }) {
  return (
    <Text
      testID="myText"
      {...props}
      style={style}
      numberOfLines={numberOfLines}
      allowFontScaling={false}
    >

      {children}
    </Text>
  );
}

CustomText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
    PropTypes.symbol,
    PropTypes.bool,
  ]),
  style: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
  ]),
  numberOfLines: PropTypes.number,
};

export default memo(CustomText);
