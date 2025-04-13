/** * *
ContactUs
* */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, ImageBackground } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { makeSelectAppLanguage, } from '../App/selectors';
import makeSelectContactUs from './selectors';
import styles from './styles';
import { COLORS, IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import { TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';


import SelectInput from '../../components/SelectInput';
import strings from '../../../i18n';
function ContactUs({language}) {
  const [selectService, setSelectedService] = useState(null);
  const { currentLanguage } = language;
  const { contactUs: contactUsMessage } = strings;
  const services = [
    { label: 'Service-1', value: 'service-1' },
    { label: 'Service-2', value: 'service-2' },
  ];

  const navigation = useNavigation();
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
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.iconContainer}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <View style={styles.icon}>
              <IMAGES.Bars height="100%" width="100%" />
            </View>
          </TouchableOpacity>
          <CustomText style={styles.heading}>{contactUsMessage.heading.defaultMessage}</CustomText>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.inputContainer}>
            <CustomText
             style={styles.label}>{contactUsMessage.serviceType.defaultMessage}</CustomText>
            <View>
              <SelectInput
                label="Select"
                options={services}
                value={selectService}
                onSelect={(item) => setSelectedService(item)}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.label}>{contactUsMessage.name.defaultMessage}</CustomText>
            <TextInput
              style={styles.input}
              placeholder={contactUsMessage.placeholder.defaultMessage}
              placeholderTextColor={COLORS.gray}
            />
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.label}>{contactUsMessage.mobile.defaultMessage}</CustomText>
            <TextInput
              style={styles.input}
              placeholder={contactUsMessage.placeholder.defaultMessage}
              placeholderTextColor={COLORS.gray}
            />
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.label}>{contactUsMessage.message.defaultMessage}</CustomText>
            <TextInput
              style={styles.messageInput}
              placeholder={contactUsMessage.placeholder.defaultMessage}
              placeholderTextColor={COLORS.gray}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <IMAGES.Message style={styles.icon} />
              <CustomText style={styles.buttonText}>{contactUsMessage.button.defaultMessage}</CustomText>
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
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(ContactUs);
