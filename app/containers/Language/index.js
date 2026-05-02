/**
 *
 * Language
 *
 */

import React, { useState, useCallback, useEffect } from 'react';
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
import { makeSelectAppLanguage, makeSelectIdealDetails } from '../App/selectors';
import strings from '../../../i18n';
import { FONTS, IMAGES, COLORS } from '../../constants';
import { hp } from '../../utils/responsive';
import { Navigation } from '../../constants/constants';
import { setLanguage, updateUserDetails } from '../App/actions';
import { getLanguage } from './actions';
import { isEqual } from 'lodash';
import { useRoute, DrawerActions } from '@react-navigation/native';

function Language({ navigation, language, languageData, idealDetails, _handleSetLanguage, _updateLanguage, _getLanguage }) {
  const { currentLanguage } = language;
  const { language: languageMessage } = strings;
  const [languageType, setLanguageType] = useState(strings.getLanguage());

  const route = useRoute();
  const fromHome = route?.params?.fromHome;

  useEffect(() => {
    _getLanguage();
  }, []);

  const updateLanguage = useCallback(() => {
    strings.setLanguage(languageType);
    const selectedLanguage = languageData.find((item) => item.code === languageType);
    _handleSetLanguage(languageType);
    const data = { language_id: selectedLanguage?.id }
    _updateLanguage({ data })
    // Always navigate to Home screen after language selection
    // using the Drawer/HomeStack path to ensure proper navigation state
    navigation.navigate('DashboardNavigator', {
      screen: 'Drawer',
      params: {
        screen: 'HomeStack',
        params: { screen: Navigation.Home },
      },
    });
  }, [languageType, navigation, _handleSetLanguage]);

  return (
    <ImageBackground
      source={IMAGES.AppBackground}
      style={styles.container}
      resizeMode="cover"
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
      {/* Header */}
      <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.iconContainer}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <View style={styles.icon}>
              <IMAGES.Bars height="100%" width="100%" />
            </View>
          </TouchableOpacity>
        <CustomText style={styles.heading} numberOfLines={1} ellipsizeMode="tail">
          {languageMessage.heading?.defaultMessage || 'Select Language'}
        </CustomText>
        <View style={{ width: 40 }} />
      </View>

      {/* Main Sheet */}
      <View style={styles.mainContainer}>
        <View style={styles.logo}>
          <IMAGES.Logo height="100%" width="100%" />
        </View>
        <CustomText style={styles.englishHeadingFont}>
          Choose Your Language
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
              <CustomText style={styles.hindiButtonFontSmall} numberOfLines={1}>
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
            style={styles.language}
            activeOpacity={0.8}
            onPress={() => setLanguageType('en')}
          >
            <View>
              <CustomText style={styles.englishButtonFont}>English</CustomText>
              <CustomText style={styles.englishButtonFontSmall} numberOfLines={1}>
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

        <TouchableOpacity
          style={styles.buttonContainer}
          activeOpacity={0.8}
          onPress={updateLanguage}
          disabled={!languageData?.[0]?.id}
        >
          <CustomText style={styles.buttonLabel}>
            {languageMessage.buttonLabel.defaultMessage}
          </CustomText>
        </TouchableOpacity>
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
  idealDetails: makeSelectIdealDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    _handleSetLanguage: (payload) => dispatch(setLanguage(payload)),
    _updateLanguage: (payload) => dispatch(updateUserDetails(payload)),
    _getLanguage: () => dispatch(getLanguage()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Language);
