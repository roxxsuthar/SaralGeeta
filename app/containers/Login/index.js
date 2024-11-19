/**
 *
 * Login
 *
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, TouchableOpacity } from 'react-native';
import { createStructuredSelector } from 'reselect';
import LinearGradient from 'react-native-linear-gradient';
import { compose } from 'redux';
import PhoneInput from 'react-native-phone-number-input';
import FastImage from 'react-native-fast-image';

import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

import makeSelectLogin from './selectors';
import styles from './styles';
import { makeSelectAppLanguage } from '../App/selectors';
import strings from '../../../i18n';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import { OS, setFontFamily } from '../../utils/device';
import { COLORS, CONSTANTS, FONTS, IMAGES } from '../../constants';
import { hp } from '../../utils/responsive';
import { Navigation } from '../../constants/constants';

function Login({ language, navigation }) {
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
    navigation.navigate(Navigation.OtpScreen);
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
            onChangeCountry={(newCountry) => onChangeCountryHandler(newCountry)}
            textInputProps={{
              placeholder: loginMessage.placeholder.defaultMessage,
              placeholderTextColor: COLORS.codGray,
              padding: 0,
              ref: phoneTextInput,
              onFocus: isEqual(OS, 'android') ? null : null,
              value: mobileNumber,
            }}
            textInputStyle={Object.assign(
              setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.REGULAR),
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
              setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.REGULAR),
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
                setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.REGULAR),
                styles.errorText,
              )}
            >
              {loginMessage.warningHalf.defaultMessage}
              {loginMessage.warningOtherHalf.defaultMessage}
            </CustomText>
          ) : null}
        </View>
        <CustomButton
          title={loginMessage.login.defaultMessage}
          labelStyle={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.buttonLabel,
          )}
          style={styles.buttonContainer}
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
          <TouchableOpacity activeOpacity={0.8} style={styles.socialIcon}>
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
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.socialIcon}>
            <View style={styles.socialIconBox}>
              <IMAGES.Google height="100%" width="100%" />
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
        <View style={styles.footerText}>
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
        </View>
      </View>
    </LinearGradient>
  );
}

Login.propTypes = {
  ...Login,
};

const mapStateToProps = createStructuredSelector({
  login: makeSelectLogin(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Login);
