/**
 *
 * OnboardingOne
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Image, StatusBar, SafeAreaView } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import strings from '../../../i18n';
import makeSelectOnboardingOne from './selectors';
import styles from './styles';
import { FONTS, IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import { Navigation } from '../../constants/constants';
import { setFontFamily } from '../../utils/device';
import { deviceAuthAction } from '../App/actions';
import { makeSelectAppLanguage } from '../App/selectors';

function OnboardingOne({ navigation, language, handleDeviceAuth }) {
  const { currentLanguage } = language;
  const [messages, setMessages] = useState(strings.OnboardingOne);

  // Set the language in strings object based on Redux state
  useEffect(() => {
    if (currentLanguage) {
      strings.setLanguage(currentLanguage);
      setMessages(strings.OnboardingOne); // Update messages after language change
    }
  }, [currentLanguage]);

  useEffect(() => {
    const getDeviceId = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        console.log('deviceId', deviceId);
        handleDeviceAuth({ device_id: deviceId });
      } catch (error) {
        // console.error('Error getting device ID:', error);
      }
    };
    getDeviceId();
  }, [handleDeviceAuth]);

  const navigateToSecond = useCallback(() => {
    navigation.navigate(Navigation.OnboardingSecond);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <Image
        resizeMode="cover"
        resizeMethod="auto"
        source={IMAGES.GeetLearn}
        style={styles.imageDimensions}
      />
      <SafeAreaView style={styles.detailContainer}>
        <CustomText
          style={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.headingText,
          )}
        >
          {messages.heading.defaultMessage}
        </CustomText>
        <CustomText
          style={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.descriptionText,
          )}
        >
          {messages.description.defaultMessage}
        </CustomText>
        <CustomButton
          title={messages.buttonLabel.defaultMessage}
          labelStyle={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.buttonLabel,
          )}
          style={styles.buttonContainer}
          onPress={() => navigateToSecond()}
        />
      </SafeAreaView>
    </View>
  );
}

OnboardingOne.propTypes = {
  navigation: PropTypes.object,
  language: PropTypes.object,
  handleDeviceAuth: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  OnboardingOne: makeSelectOnboardingOne(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleDeviceAuth: (payload) => dispatch(deviceAuthAction(payload)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(OnboardingOne);
