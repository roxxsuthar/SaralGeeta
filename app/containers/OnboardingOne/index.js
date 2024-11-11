/**
 *
 * OnboardingOne
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Image } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
// import strings from '../../../i18n';
import makeSelectOnboardingOne from './selectors';
import styles from './styles';
import { IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';

function OnboardingOne() {
  // const { OnboardingOne: OnboardingOneMessage } = strings;
  return (
    <View style={styles.container}>
      <Image
        resizeMode="cover"
        resizeMethod="auto"
        source={IMAGES.GeetLearn}
        style={styles.imageDimensions}
      />
      <View style={styles.detailContainer}>
        <CustomText style={styles.headingText}>
          Gita Learn - Simplified
        </CustomText>
        <CustomText style={styles.descriptionText}>
          Read the Gita anytime, where ever you wish.
        </CustomText>
        <CustomButton
          title="Skip"
          labelStyle={styles.buttonLabel}
          style={styles.buttonContainer}
        />
      </View>
    </View>
  );
}

OnboardingOne.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  onboardingOne: makeSelectOnboardingOne(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(OnboardingOne);
