/**
 *
 * Language
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

import makeSelectLanguage from './selectors';
import styles from './styles';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import { setFontFamily } from '../../utils/device';
import { makeSelectAppLanguage } from '../App/selectors';
import strings from '../../../i18n';
import { FONTS, IMAGES } from '../../constants';
import { hp } from '../../utils/responsive';
import { useCallback } from 'react';
import { Navigation } from '../../constants/constants';

function Language({ navigation, language }) {
  const { currentLanguage } = language;
  const { language: languageMessage } = strings;

  const navigateToNext = useCallback(() => {
    navigation.navigate(Navigation.Login);
  }, []);
  return (
    <LinearGradient
      colors={['rgb(227,126,93)', 'rgb(242,206,88)']}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <FastImage
        style={styles.chakraStyle}
        source={IMAGES.Chakra}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.mainContainer}>
        <View style={styles.logo}>
          <IMAGES.Logo height="100%" width="100%" />
        </View>
        <CustomText style={styles.englishHeadingFont}>
          Choose {'\n'}Your Language
        </CustomText>
        <CustomText style={styles.hindiHeadingFont}>अपनी भाषा चुने</CustomText>
        <View style={styles.languageSelectContainer}>
          <View style={styles.language}>
            <View>
              <CustomText style={styles.hindiButtonFont}>हिंदी</CustomText>
              <CustomText style={styles.hindiButtonFontSmall}>
                नमस्ते, स्वागत है
              </CustomText>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.radioButton}>
              <IMAGES.Circle height="100%" width="100%" />
            </TouchableOpacity>
          </View>
          <View style={{ ...styles.language, marginTop: hp(26) }}>
            <View>
              <CustomText style={styles.englishButtonFont}>English</CustomText>
              <CustomText style={styles.englishButtonFontSmall}>
                Hi, Welcome
              </CustomText>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.radioButton}>
              <IMAGES.CircleCheck height="100%" width="100%" />
            </TouchableOpacity>
          </View>
        </View>
        <CustomButton
          title={languageMessage.buttonLabel.defaultMessage}
          labelStyle={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.buttonLabel,
          )}
          style={styles.buttonContainer}
          onPress={() => navigateToNext()}
        />
      </View>
    </LinearGradient>
  );
}
Language.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  languageData: makeSelectLanguage(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Language);
