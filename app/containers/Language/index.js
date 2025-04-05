/**
 *
 * Language
 *
 */

import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
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
import { setLanguage } from '../App/actions';
import { isEqual } from 'lodash';

function Language({ navigation, language, _handleSetLanguage }) {
  const { currentLanguage } = language;
  const { language: languageMessage } = strings;
  const [languageType, setLanguageType] = useState();

  const updateLanguage = useCallback(() => {
    _handleSetLanguage(languageType);
    navigation.navigate(Navigation.Login);
  }, [languageType]);

  return (
    <ImageBackground
      source={IMAGES.AppBackground}
      style={styles.container}
      resizeMode="cover" // Similar to background-size in CSS
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
          <TouchableOpacity
            style={styles.language}
            activeOpacity={0.8}
            onPress={() => setLanguageType('hi')}
          >
            <View>
              <CustomText style={styles.hindiButtonFont}>हिंदी</CustomText>
              <CustomText style={styles.hindiButtonFontSmall}>
                नमस्ते, स्वागत है
              </CustomText>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.radioButton}
              onPress={() => setLanguageType('hi')}
            >
              {isEqual(languageType, 'hi') ? (
                <IMAGES.CircleCheck height="100%" width="100%" />
              ) : (
                <IMAGES.Circle height="100%" width="100%" />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.language, marginTop: hp(26) }}
            activeOpacity={0.8}
            onPress={() => setLanguageType('en')}
          >
            <View>
              <CustomText style={styles.englishButtonFont}>English</CustomText>
              <CustomText style={styles.englishButtonFontSmall}>
                Hi, Welcome
              </CustomText>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.radioButton}
              onPress={() => setLanguageType('en')}
            >
              {isEqual(languageType, 'en') ? (
                <IMAGES.CircleCheck height="100%" width="100%" />
              ) : (
                <IMAGES.Circle height="100%" width="100%" />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        <CustomButton
          title={languageMessage.buttonLabel.defaultMessage}
          labelStyle={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.buttonLabel,
          )}
          style={styles.buttonContainer}
          onPress={() => updateLanguage()}
        />
      </View>
    </ImageBackground>
  );
}
Language.propTypes = {
  ...Language,
};

const mapStateToProps = createStructuredSelector({
  languageData: makeSelectLanguage(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return {
    _handleSetLanguage: () => dispatch(setLanguage()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Language);
