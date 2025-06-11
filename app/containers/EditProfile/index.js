/** * *
EditProfile
* */

import React from 'react';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { View, ImageBackground, StatusBar } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import makeSelectEditProfile from './selectors';
import styles from './styles';
import { COLORS, IMAGES } from '../../constants';
import { TouchableOpacity } from 'react-native';
import CustomText from '../../components/CustomText';
import { TextInput } from 'react-native-gesture-handler';
import SelectInput from '../../components/SelectInput';
import strings from '../../../i18n';
import {
  makeSelectAppLanguage,
  makeSelectAppLoading,
  makeSelectUser,
} from '../App/selectors';
import WithKeyboardAvoidingView from '../../utils/withKeyboardView';
import { editProfile } from '../App/actions';
import { useEffect } from 'react';
import { getLanguage } from './actions';
import LoadingScreen from '../../components/LoadingScreen';

function EditProfile({
  handleGetLanguages,
  editProfile,
  handleUpdateUserDetail,
  user,
  loading,
}) {
  const { EditProfile: EditProfileMessage } = strings;
  const navigation = useNavigation();

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  function transformData(arr) {
    return arr.map((item) => ({
      id: item.id,
      label: item.name,
      value: item.id,
    }));
  }

  // Validation Schema
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    language: Yup.string().required('Language is required'),
    email: Yup.string()
      .required('Email is required')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email address',
      ),
    gender: Yup.string().required('Gender is required'),
  });

  useEffect(() => {
    handleGetLanguages();
  }, []);

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
      <WithKeyboardAvoidingView>
        <Formik
          initialValues={{
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            language: user?.language || '',
            email: user?.email || '',
            gender: user?.gender || '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleUpdateUserDetail(values, navigation);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <View style={styles.container}>
              {editProfile?.loading || loading ? (
                <LoadingScreen />
              ) : (
                <>
                  <View style={styles.header}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.iconContainer}
                      onPress={() => navigation.goBack()}
                    >
                      <View style={styles.icon}>
                        <IMAGES.ChevronLeftSolid height="100%" width="100%" />
                      </View>
                    </TouchableOpacity>
                    <CustomText style={styles.heading}>
                      {EditProfileMessage.heading.defaultMessage}
                    </CustomText>
                  </View>
                  <View style={styles.mainContainer}>
                    <View style={styles.formContainer}>
                      {/* First Name */}
                      <View style={styles.inputContainer}>
                        <CustomText style={styles.label}>
                          {EditProfileMessage.name.defaultMessage}
                        </CustomText>
                        <TextInput
                          style={styles.input}
                          placeholder="First name"
                          placeholderTextColor={COLORS.black}
                          onChangeText={handleChange('first_name')}
                          onBlur={handleBlur('first_name')}
                          value={values.first_name}
                        />
                        {touched.first_name && errors.first_name && (
                          <CustomText style={styles.errorText}>
                            {errors.first_name}
                          </CustomText>
                        )}
                      </View>

                      {/* Last Name */}
                      <View style={styles.inputContainer}>
                        <CustomText style={styles.label}>
                          {EditProfileMessage.lastName.defaultMessage}
                        </CustomText>
                        <TextInput
                          style={styles.input}
                          placeholder="Last name"
                          placeholderTextColor={COLORS.black}
                          onChangeText={handleChange('last_name')}
                          onBlur={handleBlur('last_name')}
                          value={values.last_name}
                        />
                        {touched.last_name && errors.last_name && (
                          <CustomText style={styles.errorText}>
                            {errors.last_name}
                          </CustomText>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <CustomText style={styles.label}>
                          {EditProfileMessage.email.defaultMessage}
                        </CustomText>
                        <TextInput
                          style={styles.input}
                          placeholder="Email"
                          placeholderTextColor={COLORS.black}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          value={values.email}
                        />
                        {touched.email && errors.email && (
                          <CustomText style={styles.errorText}>
                            {errors.email}
                          </CustomText>
                        )}
                      </View>

                      {/* Gender */}
                      <View style={styles.inputContainer}>
                        <CustomText style={styles.label}>
                          {EditProfileMessage.gender.defaultMessage}
                        </CustomText>
                        <SelectInput
                          label="Select gender"
                          options={genderOptions}
                          value={values.gender}
                          onSelect={(item) =>
                            setFieldValue('gender', item.value)
                          }
                        />
                        {touched.gender && errors.gender && (
                          <CustomText style={styles.errorText}>
                            {errors.gender}
                          </CustomText>
                        )}
                      </View>
                      <View style={styles.inputContainer}>
                        <CustomText style={styles.label}>
                          {EditProfileMessage.language.defaultMessage}
                        </CustomText>
                        <SelectInput
                          label="Select language"
                          options={transformData(editProfile?.language)}
                          value={values.language}
                          onSelect={(item) =>
                            setFieldValue('language', item.value)
                          }
                        />
                        {touched.language && errors.language && (
                          <CustomText style={styles.errorText}>
                            {errors.language}
                          </CustomText>
                        )}
                      </View>
                    </View>

                    {/* Submit Button */}
                    <View>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                      >
                        <CustomText style={styles.buttonText}>
                          {EditProfileMessage.update.defaultMessage}
                        </CustomText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}
        </Formik>
      </WithKeyboardAvoidingView>
    </ImageBackground>
  );
}

EditProfile.propTypes = {
  editProfile: PropTypes.object,
  handleGetLanguages: PropTypes.func,
  handleUpdateUserDetail: PropTypes.func,
  user: PropTypes.object,
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  editProfile: makeSelectEditProfile(),
  language: makeSelectAppLanguage(),
  user: makeSelectUser(),
  loading: makeSelectAppLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleGetLanguages: () => dispatch(getLanguage()),
    handleUpdateUserDetail: (payload, navigation) =>
      dispatch(editProfile(payload, navigation)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(EditProfile);
