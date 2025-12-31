import logger from '../../utils/logger';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Keyboard,
  TextInput,
  ImageBackground,
  Platform,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';

import FastImage from 'react-native-fast-image';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import SmsRetriever from 'react-native-sms-retriever';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import makeSelectOtpScreen from './selectors';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import { setFontFamily } from '../../utils/device';
import { startCountdown, stopCountdown } from '../../utils/countdown';
import {
  makeSelectAppLanguage,
  makeSelectAppLoading,
  makeSelectOtpDetails,
} from '../App/selectors';
import gt from 'lodash/gt';
import styles from './styles';
import strings from '../../../i18n';
import { CONSTANTS, FONTS, IMAGES } from '../../constants';
import { sendOtpAction, verifyOtpAction } from '../App/actions';
import LoadingScreen from '../../components/LoadingScreen';

function OtpScreen({
  language,
  navigation,
  otpDetails,
  handleVerifyOtp,
  handleSendOtp,
  loading,
}) {
  const { currentLanguage } = language;
  const otpScreenMessage = strings?.otpScreen || {}; // Ensure `strings` exists

  const timer = useRef(null);
  const otpRef = useRef(null);
  const [expired, setExpired] = useState(false);
  const [oneTimeInput, setOneTimeInput] = useState();

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
    let smsListener = null;

    const setupSmsListener = async () => {
      try {
        // Only setup SMS Retriever on Android
        if (Platform.OS !== 'android') {
          return;
        }

        const registered = await SmsRetriever.startSmsRetriever();
        if (registered) {
          smsListener = SmsRetriever.addSmsListener((event) => {
            if (event?.message) {
              const otp = /(\d{4})/g.exec(event.message)?.[1];
              if (otp) {
                setOneTimeInput(otp);
                Keyboard.dismiss();
              }
            }
          });
        }
      } catch (err) {
        logger.error('Error setting up SMS Retriever:', err);
      }
    };

    setupSmsListener();

    return () => {
      try {
        // Only cleanup if we're on Android and have a listener
        if (Platform.OS !== 'android') {
          return;
        }

        if (smsListener && typeof smsListener.remove === 'function') {
          smsListener.remove();
        } else if (
          SmsRetriever &&
          typeof SmsRetriever.removeSmsListener === 'function'
        ) {
          SmsRetriever.removeSmsListener();
        }
      } catch (err) {
        logger.error('Error removing SMS listener:', err);
      }
    };
  }, []);

  useEffect(() => {
    if (gt(oneTimeInput?.length, 3)) {
      const payload = {
        phone: otpDetails?.phone,
        otp: oneTimeInput,
      };
      const callback = () => {
        // Reset navigation stack and navigate to DashboardNavigator
        // This prevents going back to OTP/Login screens
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'DashboardNavigator' }],
          }),
        );
      };
      setTimeout(() => {
        handleVerifyOtp(payload, callback);
      }, 3000);
    }
  }, [oneTimeInput, otpDetails, navigation, handleVerifyOtp]);

  // Commented out - SMS handling is now done inline in useEffect above
  // const otpHandler = useCallback(async (message) => {
  //   try {
  //     const otp = /(\d{4})/g.exec(message)?.[1];
  //     if (otp) {
  //       setOneTimeInput(otp);
  //       SmsRetriever.removeSmsListener(); // Cleanup existing listener
  //       await setupSmsRetriever(); // Restart listener
  //     }
  //     Keyboard.dismiss();
  //   } catch (err) {
  //     logger.error('Error handling OTP:', err);
  //   }
  // }, []);

  const handleResendOTP = useCallback(() => {
    if (expired) {
      // alert(); // Commented out - no need to alert
      setOneTimeInput('');
      // setupSmsRetriever(); // Commented out - SMS listener is handled in useEffect
      handleSendOtp({ phone: otpDetails?.phone });
    }
  }, [expired, otpDetails]);

  const navigateToNext = useCallback(() => {
    const payload = {
      phone: otpDetails?.phone,
      otp: oneTimeInput,
    };
    const callback = () => {
      // Reset navigation stack and navigate to DashboardNavigator
      // This prevents going back to OTP/Login screens
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'DashboardNavigator' }],
        }),
      );
    };
    handleVerifyOtp(payload, callback);
  }, [navigation, otpDetails, oneTimeInput, handleVerifyOtp]);

  const backHandler = useCallback(() => navigation.goBack(), [navigation]);

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
      {loading ? (
        <LoadingScreen />
      ) : (
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
          <View style={styles.timerContainer}>
            <CustomText
              style={{
                ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                ...styles.labelOtp,
              }}
            >
              {otpScreenMessage.enterOtp?.defaultMessage ||
                'Enter the OTP below'}
            </CustomText>
            <View style={styles.resendCode}>
              {!expired && (
                <TextInput
                  ref={timer}
                  editable={false}
                  style={Object.assign(
                    setFontFamily(
                      currentLanguage,
                      FONTS.REGULAR,
                      FONTS.REGULAR,
                    ),
                    styles.timer1,
                  )}
                />
              )}
              {/* {expired && (
                <CustomText
                  style={Object.assign(
                    setFontFamily(
                      currentLanguage,
                      FONTS.REGULAR,
                      FONTS.REGULAR,
                    ),
                    styles.timer,
                  )}
                >
                  {otpScreenMessage.timeElapsed.defaultMessage}
                </CustomText>
              )} */}
            </View>
          </View>
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
              {otpScreenMessage.dont?.defaultMessage ||
                "Didn't receive an OTP?"}
            </CustomText>
            <TouchableOpacity
              style={styles.resendText}
              activeOpacity={0.8}
              onPress={handleResendOTP}
            >
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
      )}
    </ImageBackground>
  );
}

OtpScreen.propTypes = {
  navigation: PropTypes.object,
  language: PropTypes.object,
  otpDetails: PropTypes.object,
  handleVerifyOtp: PropTypes.func,
  handleSendOtp: PropTypes.func,
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  otpScreen: makeSelectOtpScreen(),
  language: makeSelectAppLanguage(),
  otpDetails: makeSelectOtpDetails(),
  loading: makeSelectAppLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleVerifyOtp: (payload, callback) =>
      dispatch(verifyOtpAction(payload, callback)),
    handleSendOtp: (payload) => dispatch(sendOtpAction(payload)),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(OtpScreen);
