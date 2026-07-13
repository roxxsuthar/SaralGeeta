/** * *
ContactUs
* */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, ImageBackground, TextInput } from 'react-native';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Navigation } from '../../constants/constants';
import strings from '../../../i18n';
import { addContactUs, cleanUp } from './actions';
import LoadingScreen from '../../components/LoadingScreen';
import SuccessModal from '../../components/SuccessModal';

function ContactUs({ handleSaveContactFormDetail, contactUs }) {
  const { contactUs: contactUsMessage } = strings;

  const navigation = useNavigation();
  const route = useRoute();
  const fromHome = route?.params?.fromHome;
  const [showModal, setShowModal] = React.useState(false);
  const [formActions, setFormActions] = React.useState(null);

  React.useEffect(() => {
    return () => {
      handleCleanUp();
    };
  }, []);

  React.useEffect(() => {
    if (contactUs?.success && !contactUs?.loading) {
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    }
  }, [contactUs?.success, contactUs?.loading]);

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
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.iconContainer}
                        onPress={() => navigation.goBack()}
                    >
                        <View style={styles.icon}>
                            <IMAGES.WhiteArrowIcon height="100%" width="100%" />
                        </View>
                    </TouchableOpacity>
          <CustomText style={styles.heading} numberOfLines={1} ellipsizeMode="tail">
            {contactUsMessage.heading.defaultMessage}
          </CustomText>
          <View style={{ width: 40 }} />
        </View>
        {contactUs?.loading === false && (
          <Formik
            initialValues={{
              name: '',
              email: '',
              message: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, action) => {
              setFormActions(action);
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
        {contactUs?.loading && <LoadingScreen />}
        <SuccessModal
          visible={showModal}
          message={contactUsMessage?.successMessage?.defaultMessage || 'Message sent! We\'ll be in touch soon.'}
          buttonText={contactUsMessage?.okButton?.defaultMessage || 'Ok'}
          onOk={() => {
            setShowModal(false);
            setTimeout(() => {
              handleCleanUp();
              if (formActions) {
                formActions.resetForm();
              }
              navigation.goBack();
            }, 500);
          }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

ContactUs.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleSaveContactFormDetail: PropTypes.func,
  contactUs: PropTypes.object,
  handleCleanUp: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  contactUs: makeSelectContactUs(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleSaveContactFormDetail: (payload, navigation, action) =>
      dispatch(addContactUs(payload, navigation, action)),
    handleCleanUp: () => dispatch(cleanUp()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(ContactUs);
