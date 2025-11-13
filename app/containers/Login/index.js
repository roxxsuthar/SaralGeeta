/**
 *
 * Login
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import PhoneInput from 'react-native-phone-number-input';
import FastImage from 'react-native-fast-image';

import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

import makeSelectLogin from './selectors';
import styles from './styles';
import { makeSelectAppLanguage, makeSelectAppLoading } from '../App/selectors';
import strings from '../../../i18n';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import { OS, setFontFamily } from '../../utils/device';
import { COLORS, CONSTANTS, FONTS, IMAGES } from '../../constants';
import { hp } from '../../utils/responsive';
import { oAuthAction, sendOtpAction } from '../App/actions';

function Login({
  language,
  navigation,
  handleSendOtp,
  loading,
  handleOAuthHandler,
}) {
  const { currentLanguage } = language;
  const { login: loginMessage } = strings;

  const phoneTextInput = useRef(null);
  const phoneInput = useRef(PhoneInput);
  const [mobileNumber, setMobileNumber] = useState('');
  const [country, setCountry] = useState({
    code: '91',
    alpha2Code: 'IN',
    alpha3Code: 'IND',
  });
  const [valid, setValid] = useState(true);
  const [focusedBox, setFocusedBox] = useState(false);
  const [inputStyle, setInputStyle] = useState(styles.mobileNumberOnBlur);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onChangeTextHandler = useCallback(
    (text) => setMobileNumber(text.replace(/[^0-9]/g, '')),
    [],
  );

  const erase = useCallback(() => {
    setMobileNumber('');
    phoneTextInput?.current?.clear();
    setValid(true);
  }, []);

  const onChangeCountryHandler = useCallback((countryVal) => {
    setCountry({
      code: get(countryVal, 'callingCode[0]'),
      alpha2Code: countryVal?.cca2,
      alpha3Code: countryVal?.cca2,
    });
  }, []);

  const setFocusedBoxOnBox = useCallback(() => setFocusedBox(true), []);

  const RenderCross = useCallback(() => (
    <View style={styles.closeCross}>
      <IMAGES.CloseIcon width="100%" height="100%" />
    </View>
  ));

  useEffect(() => {
    if (isEqual(focusedBox, true)) {
      setInputStyle(styles.mobileNumberOnFocus);
    } else {
      setInputStyle(styles.mobileNumberOnBlur);
    }
  }, [focusedBox]);

  const navigateToNext = useCallback(() => {
    const payload = {
      phone: mobileNumber,
    };
    handleSendOtp(payload, navigation);
  }, [mobileNumber]);

  // Configure Google Sign-In on component mount
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '875650845029-nr66a7iaslpoa9d68sl1to23ssbbkukk.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '', // Optional
      forceCodeForRefreshToken: true, // For refresh tokens
    });
  }, []);

  const sendOAuthData = useCallback(
    (token, type) => {
      const payload = {
        idToken: token,
        social_media: type,
      };
      handleOAuthHandler(payload);
    },
    [handleOAuthHandler],
  );

  const handleGoogleLogin = useCallback(async () => {
    try {
      setGoogleLoading(true);

      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Perform Google Sign-In
      const userInfo = await GoogleSignin.signIn();

      console.log('Google Sign-In Success:', userInfo);

      // Extract idToken - check both possible locations
      const idToken = userInfo?.data?.idToken || userInfo?.idToken;

      if (!idToken) {
        console.error('No idToken received from Google Sign-In');
        Alert.alert(
          'Error',
          'Failed to get authentication token. Please try again.',
        );
        setGoogleLoading(false);
        return;
      }

      // Send OAuth data to your backend
      sendOAuthData(idToken, 'Google');

      setGoogleLoading(false);
    } catch (error) {
      setGoogleLoading(false);

      console.error('Google Sign-In Error:', error);

      // Handle specific error codes
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the sign-in flow
        console.log('User cancelled Google Sign-In');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Sign-in is already in progress
        Alert.alert('Please wait', 'Sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play services not available or outdated
        Alert.alert(
          'Google Play Services',
          'Google Play Services are not available or outdated on this device',
        );
      } else {
        // Other errors
        Alert.alert(
          'Sign-In Failed',
          error.message || 'An error occurred during Google Sign-In',
        );
      }
    }
  }, [sendOAuthData]);

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
      <View style={styles.mainContainer}>
        <View>
          <View style={styles.logo}>
            <IMAGES.Logo height="100%" width="100%" />
          </View>
          <CustomText
            style={Object.assign(
              setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
              styles.englishHeadingFont,
            )}
          >
            {loginMessage.heading.defaultMessage}
          </CustomText>
          <CustomText
            style={Object.assign(
              setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
              styles.subHeading,
            )}
          >
            {loginMessage.subHeading.defaultMessage}
          </CustomText>
          <View style={styles.phoneNumberContainer}>
            <CustomText
              style={Object.assign(
                setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                styles.phoneNumberLabel,
              )}
            >
              {loginMessage.number.defaultMessage}
            </CustomText>
            <PhoneInput
              bottomSheetHeading={Object.assign(
                setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.REGULAR),
                styles.bottomSheetHeading,
              )}
              layout="second"
              headingText={loginMessage.bottomSheetHeading.defaultMessage}
              closeButtonImage={IMAGES.ChevronLeft}
              closeButtonStyle={styles.closeButtonStyle}
              countryTextStyle={styles.countryTextStyle}
              filterProps={{
                style: styles.filterStyle,
                placeholder: loginMessage.countryPlaceholder.defaultMessage,
              }}
              ref={phoneInput}
              value={mobileNumber}
              code={country.code}
              defaultCode={country.alpha2Code}
              onChangeText={onChangeTextHandler}
              onChangeCountry={(newCountry) =>
                onChangeCountryHandler(newCountry)
              }
              textInputProps={{
                placeholder: loginMessage.placeholder.defaultMessage,
                placeholderTextColor: COLORS.codGray,
                padding: 0,
                ref: phoneTextInput,
                onFocus: isEqual(OS, 'android') ? null : null,
                value: mobileNumber,
              }}
              textInputStyle={Object.assign(
                setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                {
                  paddingBottom: isEqual(currentLanguage, CONSTANTS.HICode)
                    ? hp(0.62)
                    : 0,
                },
                styles.numberText,
              )}
              textContainerStyle={styles.number}
              containerStyle={inputStyle}
              countryPickerButtonStyle={styles.countryCode}
              codeTextStyle={Object.assign(
                setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                styles.codeTextStyle,
              )}
              showCross={mobileNumber > 0}
              CloseCross={RenderCross}
              closeCrossContainerStyle={styles.closeCrossContainer}
              closeCrossStyle={styles.closeCross}
              clear={erase}
              focusedBox={setFocusedBoxOnBox}
              keyboardType="phone-pad"
              flagButtonStyle={styles.flagButton}
            />
            {!valid ? (
              <CustomText
                style={Object.assign(
                  setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                  styles.errorText,
                )}
              >
                {loginMessage.warningHalf.defaultMessage}
                {loginMessage.warningOtherHalf.defaultMessage}
              </CustomText>
            ) : null}
          </View>
          <CustomButton
            title={
              loading ? (
                <ActivityIndicator />
              ) : (
                loginMessage.login.defaultMessage
              )
            }
            labelStyle={Object.assign(
              setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
              styles.buttonLabel,
            )}
            disabled={loading}
            style={styles.buttonContainer}
            disabledStyle={styles.buttonContainer}
            onPress={() => navigateToNext()}
          />
          <View style={styles.mainLineContainer}>
            <View style={styles.line} />
            <CustomText
              style={Object.assign(
                setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                styles.continueText,
              )}
            >
              {loginMessage.continue.defaultMessage}
            </CustomText>
            <View style={styles.line} />
          </View>
          <View style={styles.socialIconContainer}>
            {/* <TouchableOpacity activeOpacity={0.8} style={styles.socialIcon}>
              <View style={styles.socialIconBox}>
                <IMAGES.Facebook height="100%" width="100%" />
              </View>
              <CustomText
                style={Object.assign(
                  setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                  styles.facebookText,
                )}
              >
                {loginMessage.facebook.defaultMessage}
              </CustomText>
            </TouchableOpacity> */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.socialIcon}
              onPress={handleGoogleLogin}
              disabled={googleLoading || loading}
            >
              <View style={styles.socialIconBox}>
                {googleLoading ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <IMAGES.Google height="100%" width="100%" />
                )}
              </View>
              <CustomText
                style={Object.assign(
                  setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                  styles.facebookText,
                )}
              >
                {loginMessage.google.defaultMessage}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.footerText}>
          <CustomText
            style={Object.assign(
              setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
              styles.dont,
            )}
          >
            {loginMessage.dont.defaultMessage}
          </CustomText>
          <TouchableOpacity activeOpacity={0.8}>
            <CustomText
              style={Object.assign(
                setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                styles.create,
              )}
            >
              {loginMessage.create.defaultMessage}
            </CustomText>
          </TouchableOpacity>
        </View> */}
      </View>
    </ImageBackground>
  );
}

Login.propTypes = {
  ...Login,
};

const mapStateToProps = createStructuredSelector({
  login: makeSelectLogin(),
  language: makeSelectAppLanguage(),
  loading: makeSelectAppLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleSendOtp: (payload, callback) =>
      dispatch(sendOtpAction(payload, callback)),
    handleOAuthHandler: (payload) => dispatch(oAuthAction(payload)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Login);
