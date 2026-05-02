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
import { Formik } from 'formik';
import * as Yup from 'yup';
import makeSelectContactUs from './selectors';
import styles from './styles';
import { COLORS, IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import { TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation, useRoute } from '@react-navigation/native';
import { Navigation } from '../../constants/constants';
import strings from '../../../i18n';
import { addContactUs } from './actions';
import LoadingScreen from '../../components/LoadingScreen';

function ContactUs({ handleSaveContactFormDetail, contactUs }) {
  const { contactUs: contactUsMessage } = strings;

  const navigation = useNavigation();
  const route = useRoute();
  const fromHome = route?.params?.fromHome;

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    message: Yup.string().required('Message is required'),
  });

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
          <CustomText style={styles.heading} numberOfLines={1} ellipsizeMode="tail">
            {contactUsMessage.heading.defaultMessage}
          </CustomText>
          <View style={{ width: 40 }} />
        </View>
        {contactUs?.loading ? (
          <LoadingScreen />
        ) : (
          <Formik
            initialValues={{
              name: '',
              email: '',
              message: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, action) => {
              handleSaveContactFormDetail(values, navigation, action);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.mainContainer}>
                {/* Name */}
                <View style={styles.inputContainer}>
                  <CustomText style={styles.label}>
                    {contactUsMessage.name.defaultMessage}
                  </CustomText>
                  <TextInput
                    style={styles.input}
                    placeholder={contactUsMessage.placeholder.defaultMessage}
                    placeholderTextColor={COLORS.gray}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    allowFontScaling={false}
                  />

                  {touched.name && errors.name && (
                    <CustomText style={styles.errorText}>
                      {errors.name}
                    </CustomText>
                  )}
                </View>

                {/* Mobile */}
                <View style={styles.inputContainer}>
                  <CustomText style={styles.label}>
                    {contactUsMessage.email.defaultMessage}
                  </CustomText>
                  <TextInput
                    style={styles.input}
                    placeholder={contactUsMessage.placeholder.defaultMessage}
                    placeholderTextColor={COLORS.gray}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    allowFontScaling={false}
                  />

                  {touched.email && errors.email && (
                    <CustomText style={styles.errorText}>
                      {errors.email}
                    </CustomText>
                  )}
                </View>

                {/* Message */}
                <View style={styles.inputContainer}>
                  <CustomText style={styles.label}>
                    {contactUsMessage.message.defaultMessage}
                  </CustomText>
                  <TextInput
                    style={styles.messageInput}
                    placeholder={contactUsMessage.placeholder.defaultMessage}
                    placeholderTextColor={COLORS.gray}
                    onChangeText={handleChange('message')}
                    onBlur={handleBlur('message')}
                    value={values.message}
                    multiline
                    allowFontScaling={false}
                  />

                  {touched.message && errors.message && (
                    <CustomText style={styles.errorText}>
                      {errors.message}
                    </CustomText>
                  )}
                </View>

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                  >
                    <IMAGES.Message style={styles.icon} />
                    <CustomText style={styles.buttonText}>
                      {contactUsMessage.button.defaultMessage}
                    </CustomText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        )}
      </View>
    </ImageBackground>
  );
}

ContactUs.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleSaveContactFormDetail: PropTypes.func,
  contactUs: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  contactUs: makeSelectContactUs(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleSaveContactFormDetail: (payload, navigation, action) =>
      dispatch(addContactUs(payload, navigation, action)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(ContactUs);
