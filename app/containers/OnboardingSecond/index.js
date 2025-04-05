/**
 *
 * OnboardingSecond
 *
 */

import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { View, Image, StatusBar } from 'react-native';
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
import { setOnboardingVisited } from '../App/actions';

function OnboardingSecond({ navigation, language, _handleSetOnboarding }) {
  const { OnboardingSecond: OnboardingSecondMessage } = strings;
  const { currentLanguage } = language;

  const navigateToLogin = useCallback(() => {
    _handleSetOnboarding();
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
    _handleSetOnboarding: () => dispatch(setOnboardingVisited()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(OnboardingSecond);
