/**
 *
 * OnboardingSecond
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { View, Image, StatusBar, SafeAreaView } from 'react-native';
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
import { makeSelectAppLanguage, makeSelectToken } from '../App/selectors';
import { setOnboardingVisited } from '../App/actions';
import isNil from 'lodash/isNil';

function OnboardingSecond({
  navigation,
  language,
  _handleSetOnboarding,
  token,
}) {
  const { currentLanguage } = language;
  const [messages, setMessages] = useState(strings.OnboardingSecond);

  // Set the language in strings object based on Redux state
  useEffect(() => {
    if (currentLanguage) {
      strings.setLanguage(currentLanguage);
      setMessages(strings.OnboardingSecond); // Update messages after language change
    }
  }, [currentLanguage]);

  const navigateToLogin = useCallback(() => {
    _handleSetOnboarding();
    // If user has token (logged in), go directly to DashboardNavigator (Home)
    // Otherwise, go to Login screen
    if (!isNil(token)) {
      navigation.navigate('DashboardNavigator');
    } else {
      navigation.navigate(Navigation.Login);
    }
  }, [_handleSetOnboarding, token, navigation]);

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
          onPress={() => navigateToLogin()}
        />
      </SafeAreaView>
    </View>
  );
}

OnboardingSecond.propTypes = {
  ...OnboardingSecond,
};

const mapStateToProps = createStructuredSelector({
  onboardingSecond: makeSelectOnboardingSecond(),
  language: makeSelectAppLanguage(),
  token: makeSelectToken(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    _handleSetOnboarding: () => dispatch(setOnboardingVisited()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(OnboardingSecond);
