/**
 *
 * OnboardingOne
 *
 */

import React, { useCallback } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Image, StatusBar } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import strings from '../../../i18n';
import makeSelectOnboardingOne from './selectors';
import styles from './styles';
import { FONTS, IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import { Navigation } from '../../constants/constants';
import { makeSelectAppLanguage } from '../App/selectors';
import { setFontFamily } from '../../utils/device';

function OnboardingOne({ navigation, language }) {
  const { OnboardingOne: OnboardingOneMessage } = strings;
  const { currentLanguage } = language;

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
      <View style={styles.detailContainer}>
        <CustomText
          style={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.headingText,
          )}
        >
          {OnboardingOneMessage.heading.defaultMessage}
        </CustomText>
        <CustomText
          style={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.descriptionText,
          )}
        >
          {OnboardingOneMessage.description.defaultMessage}
        </CustomText>
        <CustomButton
          title={OnboardingOneMessage.buttonLabel.defaultMessage}
          labelStyle={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.buttonLabel,
          )}
          style={styles.buttonContainer}
          onPress={() => navigateToSecond()}
        />
      </View>
    </View>
  );
}

OnboardingOne.propTypes = {
  ...OnboardingOne,
};

const mapStateToProps = createStructuredSelector({
  OnboardingOne: makeSelectOnboardingOne(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(OnboardingOne);
