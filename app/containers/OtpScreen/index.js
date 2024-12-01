import React, { useCallback, useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Keyboard,
  TextInput,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import SmsRetriever from 'react-native-sms-retriever';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import makeSelectOtpScreen from './selectors';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import { OS, setFontFamily } from '../../utils/device';
import { startCountdown, stopCountdown } from '../../utils/countdown';
import { makeSelectAppLanguage } from '../App/selectors';
import isEqual from 'lodash/isEqual';
import styles from './styles';
import strings from '../../../i18n';
import { CONSTANTS, FONTS, IMAGES } from '../../constants';

function OtpScreen({ language, navigation }) {
  const { currentLanguage } = language;
  const otpScreenMessage = strings?.otpScreen || {}; // Ensure `strings` exists

  const timer = useRef(null);
  const otpRef = useRef(null);
  const [expired, setExpired] = useState(false);
  const [oneTimeInput, setOneTimeInput] = useState('');

  const onFinish = useCallback(() => setExpired(true), []);
  const onStart = useCallback(() => setExpired(false), []);

  useEffect(() => {
    startCountdown(timer, CONSTANTS.time, onStart, onFinish);
    return () => {
      stopCountdown();
      onFinish();
    };
  }, []);

  // Focus on the first OTP input field after the screen loads
  useEffect(() => {
    if (otpRef.current) {
      setTimeout(() => otpRef.current?.focusField(0), 250);
    }
  }, []);

  // Android-specific SMS Retriever setup
  useEffect(() => {
    if (isEqual(OS, 'android')) {
      setupSmsRetriever();
    }
    return () => {
      SmsRetriever.removeSmsListener();
    };
  }, []);

  const setupSmsRetriever = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      if (registered) {
        SmsRetriever.addSmsListener(async (event) => {
          otpHandler(event?.message);
        });
      }
    } catch (err) {
      console.error('Error setting up SMS Retriever:', err);
    }
  };

  const otpHandler = useCallback(async (message) => {
    try {
      const otp = /(\d{4})/g.exec(message)?.[1];
      if (otp) {
        setOneTimeInput(otp);
        SmsRetriever.removeSmsListener(); // Cleanup existing listener
        await setupSmsRetriever(); // Restart listener
      }
      Keyboard.dismiss();
    } catch (err) {
      console.error('Error handling OTP:', err);
    }
  }, []);

  const handleResendOTP = useCallback(() => {
    if (expired) {
      setOneTimeInput('');
      setupSmsRetriever();
      // Optionally: Call API to resend OTP
    }
  }, [expired]);

  const navigateToNext = useCallback(() => {
    navigation.navigate('Login'); // Ensure 'Login' is defined in your navigator
  }, [navigation]);

  const backHandler = useCallback(() => navigation.goBack(), [navigation]);

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
        {/* Back Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={backHandler}
          style={styles.headerContainer}
        >
          <View style={styles.icon}>
            <IMAGES.LeftArrow height="100%" width="100%" />
          </View>
        </TouchableOpacity>

        {/* Headings */}
        <CustomText
          style={{
            ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            ...styles.englishHeadingFont,
          }}
        >
          {otpScreenMessage.heading?.defaultMessage || 'Enter OTP'}
        </CustomText>
        <CustomText
          style={{
            ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            ...styles.subHeading,
          }}
        >
          {otpScreenMessage.subHeading?.defaultMessage ||
            'We sent an OTP to your number'}
        </CustomText>
        <CustomText
          style={{
            ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            ...styles.labelOtp,
          }}
        >
          {otpScreenMessage.enterOtp?.defaultMessage || 'Enter the OTP below'}
        </CustomText>

        {/* OTP Input */}
        <View style={styles.OtpContainer}>
          <OTPInputView
            pinCount={4}
            ref={otpRef}
            code={oneTimeInput}
            codeInputFieldStyle={styles.box}
            autoFocusOnLoad={false}
            onCodeChanged={setOneTimeInput}
            autofillFromClipboard={false}
          />
        </View>
        <View style={styles.resendCode}>
          {!expired && (
            <TextInput
              ref={timer}
              editable={false}
              style={Object.assign(
                setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.REGULAR),
                styles.timer1,
              )}
            />
          )}
          {expired && (
            <CustomText
              style={Object.assign(
                setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.REGULAR),
                styles.timer,
              )}
            >
              {otpScreenMessage.timeElapsed.defaultMessage}
            </CustomText>
          )}
        </View>
        {/* Submit Button */}
        <CustomButton
          title={otpScreenMessage.submit?.defaultMessage || 'Submit'}
          labelStyle={{
            ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            ...styles.buttonLabel,
          }}
          style={styles.buttonContainer}
          onPress={navigateToNext}
        />

        {/* Footer */}
        <View style={styles.footerText}>
          <CustomText
            style={{
              ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
              ...styles.dont,
            }}
          >
            {otpScreenMessage.dont?.defaultMessage || "Didn't receive an OTP?"}
          </CustomText>
          <TouchableOpacity activeOpacity={0.8} onPress={handleResendOTP}>
            <CustomText
              style={{
                ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                ...styles.create,
              }}
            >
              {otpScreenMessage.create?.defaultMessage || 'Resend'}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

OtpScreen.propTypes = {
  navigation: PropTypes.object,
  language: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  otpScreen: makeSelectOtpScreen(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(OtpScreen);
