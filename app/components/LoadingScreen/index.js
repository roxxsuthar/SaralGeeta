/**
 *
 * LoadingScreen
 *
 */

import React, { memo } from 'react';

import { View, ActivityIndicator, Modal } from 'react-native';
import PropTypes from 'prop-types';

import defaultStyles from './styles';
import { COLORS, FONTS } from '../../constants';
import CustomText from '../CustomText';
import { setFontFamily } from '../../utils/device';
function LoadingScreen({ currentLanguage }) {
  return (
    <Modal transparent statusBarTranslucent animationType="none">
      <View style={defaultStyles.container}>
        <View
          style={{
            ...defaultStyles.container,
            ...{ backgroundColor: COLORS.loadingTransparent },
          }}
        >
          <View style={defaultStyles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.flamingo} />
            <CustomText
              style={Object.assign(
                setFontFamily(
                  currentLanguage,
                  FONTS.REGULAR,
                  FONTS.HINDI_REGULAR,
                ),
                defaultStyles.loadingText,
              )}
            >
              loading.....
            </CustomText>
          </View>
        </View>
      </View>
    </Modal>
  );
}

LoadingScreen.propTypes = {
  currentLanguage: PropTypes.string,
};

export default memo(LoadingScreen);
