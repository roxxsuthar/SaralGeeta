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
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import FastImage from 'react-native-fast-image';

import makeSelectLanguage from './selectors';
import styles from './styles';
import CustomText from '../../components/CustomText';
import { makeSelectAppLanguage, makeSelectIdealDetails } from '../App/selectors';
import strings from '../../../i18n';
import { IMAGES } from '../../constants';
import { Navigation } from '../../constants/constants';
import { setLanguage, updateUserDetails } from '../App/actions';
import { getLanguage } from './actions';
import { isEqual } from 'lodash';
import { useRoute } from '@react-navigation/native';

const LANG_METADATA = {
  en: { title: 'English', subtitle: 'Hi, Welcome' },
  hi: { title: 'हिंदी', subtitle: 'नमस्ते, स्वागत है' },
  ta: { title: 'தமிழ்', subtitle: 'வணக்கம், நல்வரவு' },
  mr: { title: 'मराठी', subtitle: 'नमस्कार, स्वागत आहे' },
  kn: { title: 'ಕನ್ನಡ', subtitle: 'ನಮಸ್ಕಾರ, ಸ್ವಾಗತ' },
  gu: { title: 'ગુજરાતી', subtitle: 'નમસ્તે, સ્વાગત છે' },
  or: { title: 'ଓଡ଼ିଆ', subtitle: 'ନମସ୍କାର, ସ୍ୱାଗତମ୍' },
  bn: { title: 'বাংলা', subtitle: 'নমস্কার, স্বাগতম' },
};

function Language({ navigation, languageData, _handleSetLanguage, _updateLanguage, _getLanguage }) {
  const { language: languageMessage } = strings;
  const [languageType, setLanguageType] = useState(strings.getLanguage());

  const route = useRoute();

  useEffect(() => {
    _getLanguage();
  }, []);

  const updateLanguage = useCallback(() => {
    strings.setLanguage(languageType);
    const selectedLanguage = languageData?.find((item) => item.code === languageType);
    _handleSetLanguage(languageType);
    const data = { language_id: selectedLanguage?.id || 1 }
    _updateLanguage({ data })
    navigation.navigate('DashboardNavigator', {
      screen: 'Drawer',
      params: {
        screen: 'HomeStack',
        params: { screen: Navigation.Home },
      },
    });
  }, [languageType, navigation, _handleSetLanguage, languageData]);

  const renderLanguageItem = ({ item }) => {
    const isSelected = isEqual(languageType, item.code);
    return (
      <TouchableOpacity
        style={styles.language}
        activeOpacity={0.8}
        onPress={() => setLanguageType(item.code)}
      >
        <View>
          <CustomText style={styles.languageTitleFont}>{item.title}</CustomText>
          <CustomText style={styles.languageSubtitleFont} numberOfLines={1}>
            {item.subtitle}
          </CustomText>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.radioButton}
          onPress={() => setLanguageType(item.code)}
        >
          {isSelected ? (
            <IMAGES.CircleCheck height="100%" width="100%" />
          ) : (
            <IMAGES.Circle height="100%" width="100%" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const getLanguageList = () => {
    return Object.keys(LANG_METADATA).map(code => {
      const apiLang = languageData?.find(lang => lang.code === code);
      return {
        ...apiLang, // merge any api properties like id
        code,
        title: LANG_METADATA[code].title,
        subtitle: LANG_METADATA[code].subtitle,
        id: apiLang?.id || null, // default to null if not in API yet
      };
    });
  };

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
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.iconContainer}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.icon}>
              <IMAGES.WhiteArrowIcon height="100%" width="100%" />
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

          <FlatList
            data={getLanguageList()}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.code}
            style={styles.languageSelectContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

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
      </SafeAreaView>
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
