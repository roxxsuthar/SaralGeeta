/** * *
ContactUs
* */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, ImageBackground } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import makeSelectContactUs from './selectors';
import styles from './styles';
import { COLORS, IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import { TouchableOpacity } from 'react-native';
function ContactUs() {
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
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.8} style={styles.iconContainer}>
            <View style={styles.icon}>
              <IMAGES.Bars height="100%" width="100%" />
            </View>
          </TouchableOpacity>
          <CustomText style={styles.heading}>Contact Us</CustomText>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.inputContainer}>
            <CustomText style={styles.label}>Service Type</CustomText>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Select"
                placeholderTextColor={COLORS.black}
              />
              <IMAGES.ChevronDown
                style={styles.inputIcon}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.label}>Name</CustomText>
            <TextInput
              style={styles.input}
              placeholder="Type here...."
              placeholderTextColor={COLORS.gray}
            />
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.label}>Mobile Number</CustomText>
            <TextInput
              style={styles.input}
              placeholder="Type here...."
              placeholderTextColor={COLORS.gray}
            />
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.label}>Message</CustomText>
            <TextInput
              style={styles.messageInput}
              placeholder="Type here...."
              placeholderTextColor={COLORS.gray}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
            <IMAGES.Message
                style={styles.icon}
              />
              <CustomText style={styles.buttonText}>Send Message</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

ContactUs.propTypes = { dispatch: PropTypes.func.isRequired };

const mapStateToProps = createStructuredSelector({
  contactUs: makeSelectContactUs(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(ContactUs);
