/**
 *
 * OnboardingSecond
 *
 */

import React, { useCallback } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Image, StatusBar } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import strings from '../../../i18n';
import makeSelectOnboardingSecond from './selectors';
import styles from './styles';
import { FONTS, IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import { Navigation } from '../../constants/constants';
import { setFontFamily } from '../../utils/device';
import { makeSelectAppLanguage } from '../App/selectors';

function OnboardingSecond({ navigation, language }) {
  const { OnboardingSecond: OnboardingSecondMessage } = strings;
  const { currentLanguage } = language;
  const navigateToLogin = useCallback(() => {
    navigation.navigate(Navigation.Language);
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
        source={IMAGES.KrishnaImage}
        style={styles.imageDimensions}
      />
      <View style={styles.detailContainer}>
        <CustomText
          style={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.headingText,
          )}
        >
          {OnboardingSecondMessage.heading.defaultMessage}
        </CustomText>
        <CustomText
          style={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.descriptionText,
          )}
        >
          {OnboardingSecondMessage.description.defaultMessage}
        </CustomText>
        <CustomButton
          title={OnboardingSecondMessage.buttonLabel.defaultMessage}
          labelStyle={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.buttonLabel,
          )}
          style={styles.buttonContainer}
          onPress={() => navigateToLogin()}
        />
      </View>
    </View>
  );
}

OnboardingSecond.propTypes = {
  ...OnboardingSecond,
};

const mapStateToProps = createStructuredSelector({
  onboardingSecond: makeSelectOnboardingSecond(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(OnboardingSecond);
