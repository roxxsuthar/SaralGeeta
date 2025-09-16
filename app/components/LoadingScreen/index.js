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
    <Modal
      transparent
      statusBarTranslucent
      animationType="none"
      testID="loading-screen-modal"
    >
      <View
        style={defaultStyles.container}
        testID="loading-screen-main-container"
      >
        <View
          style={{
            ...defaultStyles.container,
            ...{ backgroundColor: COLORS.loadingTransparent },
          }}
          testID="loading-screen-background"
        >
          <View
            style={defaultStyles.loadingContainer}
            testID="loading-screen-loading-container"
          >
            <ActivityIndicator
              size="large"
              color={COLORS.flamingo}
              testID="loading-screen-activity-indicator"
            />
            <CustomText
              style={Object.assign(
                setFontFamily(
                  currentLanguage,
                  FONTS.REGULAR,
                  FONTS.HINDI_REGULAR,
                ),
                defaultStyles.loadingText,
              )}
              testID="loading-screen-text"
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
