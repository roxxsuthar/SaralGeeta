/**
 *
 * TeacherGift
 *
 */

import React, { memo, useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { DrawerActions, useNavigation, useFocusEffect } from '@react-navigation/native';

import makeSelectTeacherGift from './selectors';
import makeSelectHome from '../Home/selectors';
import { makeSelectAppLanguage } from '../App/selectors';
import styles from './styles';
import { COLORS, IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import strings from '../../../i18n';
import { submitTeacherGift, cleanUp } from './actions';
import { getChapters } from '../Home/actions';
import LoadingScreen from '../../components/LoadingScreen';
import SuccessModal from '../../components/SuccessModal';
import ConfirmModal from '../../components/ConfirmModal';
import { SafeAreaView } from 'react-native-safe-area-context';

function TeacherGift({ teacherGift, home, appLanguage, handleGetChapters, handleSubmitForm, handleCleanUp }) {
    strings.setLanguage(appLanguage);
    const { teacherGift: teacherGiftStrings, Home: HomeMessage } = strings;
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [formActions, setFormActions] = useState(null);
    const [tempValues, setTempValues] = useState(null);

    useFocusEffect(
        useCallback(() => {
            handleGetChapters(appLanguage);
            return () => {
                handleCleanUp();
            };
        }, [handleGetChapters, handleCleanUp, appLanguage])
    );

    useEffect(() => {
        if (teacherGift?.success && !teacherGift?.loading) {
            setShowModal(true);
        }
    }, [teacherGift?.success, teacherGift?.loading]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]+$/, 'Must be only digits')
            .min(10, 'Must be at least 10 digits')
            .required('Phone number is required'),
        address: Yup.string().required('Address is required'),
        district: Yup.string().required('District is required'),
        pincode: Yup.string()
            .matches(/^[0-9]+$/, 'Must be only digits')
            .length(6, 'Must be exactly 6 digits')
            .required('Pin code is required'),
        chapters: Yup.array().min(1, 'Please select at least one chapter'),
    });

    const chapters = home?.data || [];

    const handleSubmitPress = (values, action) => {
        setTempValues(values);
        setFormActions(action);
        setShowConfirmModal(true);
    };

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
            <SafeAreaView style={styles.container}>
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
                        {teacherGiftStrings?.heading?.defaultMessage || 'Teacher Details'}
                    </CustomText>
                    <View style={{ width: 40 }} />
                </View>

                {teacherGift?.loading ? (
                    <LoadingScreen />
                ) : (
                    <View style={styles.mainContainer}>
                        <Formik
                            initialValues={{
                                name: '',
                                phoneNumber: '',
                                address: '',
                                district: '',
                                pincode: '',
                                chapters: [],
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, action) => {
                                handleSubmitPress(values, action);
                            }}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                setFieldValue,
                                values,
                                errors,
                                touched,
                            }) => (
                                <>
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{ flexGrow: 1 }}
                                    >
                                        <View style={styles.inputContainer}>
                                            <CustomText style={styles.label}>
                                                {teacherGiftStrings?.name?.defaultMessage || 'Teacher Name'}
                                            </CustomText>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={teacherGiftStrings?.placeholderName?.defaultMessage || 'Enter teacher name'}
                                                placeholderTextColor={COLORS.gray}
                                                onChangeText={handleChange('name')}
                                                onBlur={handleBlur('name')}
                                                value={values.name}
                                                allowFontScaling={false}
                                            />

                                            {touched.name && errors.name && (
                                                <CustomText style={styles.errorText}>{errors.name}</CustomText>
                                            )}
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <CustomText style={styles.label}>
                                                {teacherGiftStrings?.phoneNumber?.defaultMessage || 'Phone Number'}
                                            </CustomText>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={teacherGiftStrings?.placeholderPhone?.defaultMessage || 'Enter phone number'}
                                                placeholderTextColor={COLORS.gray}
                                                keyboardType="phone-pad"
                                                onChangeText={handleChange('phoneNumber')}
                                                onBlur={handleBlur('phoneNumber')}
                                                value={values.phoneNumber}
                                                allowFontScaling={false}
                                            />

                                            {touched.phoneNumber && errors.phoneNumber && (
                                                <CustomText style={styles.errorText}>{errors.phoneNumber}</CustomText>
                                            )}
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <CustomText style={styles.label}>
                                                {teacherGiftStrings?.address?.defaultMessage || 'Address'}
                                            </CustomText>
                                            <TextInput
                                                style={styles.textarea}
                                                placeholder={teacherGiftStrings?.placeholderAddress?.defaultMessage || 'Enter full address'}
                                                placeholderTextColor={COLORS.gray}
                                                multiline
                                                onChangeText={handleChange('address')}
                                                onBlur={handleBlur('address')}
                                                value={values.address}
                                                allowFontScaling={false}
                                            />

                                            {touched.address && errors.address && (
                                                <CustomText style={styles.errorText}>{errors.address}</CustomText>
                                            )}
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <CustomText style={styles.label}>
                                                {strings?.writeGita?.district?.defaultMessage || 'District'}
                                            </CustomText>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={strings?.writeGita?.placeholderDistrict?.defaultMessage || "Enter your district"}
                                                placeholderTextColor={COLORS.gray}
                                                onChangeText={handleChange('district')}
                                                onBlur={handleBlur('district')}
                                                value={values.district}
                                                allowFontScaling={false}
                                            />
                                            {touched.district && errors.district && (
                                                <CustomText style={styles.errorText}>{errors.district}</CustomText>
                                            )}
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <CustomText style={styles.label}>
                                                {strings?.writeGita?.pincode?.defaultMessage || 'Pin Code'}
                                            </CustomText>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={strings?.writeGita?.placeholderPincode?.defaultMessage || "Enter your pin code"}
                                                placeholderTextColor={COLORS.gray}
                                                keyboardType="numeric"
                                                maxLength={6}
                                                onChangeText={handleChange('pincode')}
                                                onBlur={handleBlur('pincode')}
                                                value={values.pincode}
                                                allowFontScaling={false}
                                            />
                                            {touched.pincode && errors.pincode && (
                                                <CustomText style={styles.errorText}>{errors.pincode}</CustomText>
                                            )}
                                        </View>

                                        <View style={styles.chapterListContainer}>
                                            <CustomText style={styles.label}>
                                                {teacherGiftStrings?.chaptersLabel?.defaultMessage || 'Select Chapters'}
                                            </CustomText>
                                            {chapters.map((chapter) => (
                                                <TouchableOpacity
                                                    key={chapter.id}
                                                    style={styles.chapterItem}
                                                    onPress={() => {
                                                        const currentChapters = values.chapters;
                                                        const nextChapters = currentChapters.includes(chapter.id)
                                                            ? currentChapters.filter((id) => id !== chapter.id)
                                                            : [...currentChapters, chapter.id];
                                                        setFieldValue('chapters', nextChapters);
                                                    }}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={[
                                                        styles.checkbox,
                                                        values.chapters.includes(chapter.id) && styles.checkboxChecked
                                                    ]}>
                                                        {values.chapters.includes(chapter.id) && (
                                                            <View style={{ width: 12, height: 12, backgroundColor: 'white', borderRadius: 2 }} />
                                                        )}
                                                    </View>
                                                    <CustomText style={[
                                                        styles.chapterName,
                                                        values.chapters.includes(chapter.id) && { color: COLORS.orange, fontFamily: 'Outfit-Bold' }
                                                    ]}>{chapter.name}{'  ('}
                                                        {HomeMessage.chapter.defaultMessage} {chapter?.serial}
                                                        {')'}</CustomText>
                                                </TouchableOpacity>
                                            ))}
                                            {touched.chapters && errors.chapters && (
                                                <CustomText style={styles.errorText}>{errors.chapters}</CustomText>
                                            )}
                                        </View>
                                    </ScrollView>

                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={handleSubmit}
                                        >
                                            <CustomText style={styles.buttonText}>
                                                {teacherGiftStrings?.button?.defaultMessage || 'Submit'}
                                            </CustomText>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </Formik>
                    </View>
                )}

                <SuccessModal
                    visible={showModal}
                    message={teacherGiftStrings?.successMessage?.defaultMessage || 'We will connect with you shortly.'}
                    buttonText={teacherGiftStrings?.okButton?.defaultMessage || 'Ok'}
                    onOk={() => {
                        setShowModal(false);
                        handleCleanUp();
                        if (formActions) {
                            formActions.resetForm();
                        }
                        navigation.goBack();
                    }}
                />
                <ConfirmModal
                    visible={showConfirmModal}
                    title={teacherGiftStrings?.alertTitle?.defaultMessage || 'Confirmation'}
                    message={teacherGiftStrings?.alertMessage?.defaultMessage || 'Have you entered correct address?'}
                    cancelText={teacherGiftStrings?.alertNo?.defaultMessage || 'No'}
                    confirmText={teacherGiftStrings?.alertYes?.defaultMessage || 'Yes'}
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={() => {
                        setShowConfirmModal(false);
                        handleSubmitForm(tempValues, navigation, formActions);
                    }}
                />
            </SafeAreaView>
        </ImageBackground>
    );
}

TeacherGift.propTypes = {
    teacherGift: PropTypes.object,
    home: PropTypes.object,
    appLanguage: PropTypes.string,
    handleGetChapters: PropTypes.func,
    handleSubmitForm: PropTypes.func,
    handleCleanUp: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
    teacherGift: makeSelectTeacherGift(),
    home: makeSelectHome(),
    appLanguage: (state) => state.app?.language?.currentLanguage,
});

function mapDispatchToProps(dispatch) {
    return {
        handleGetChapters: (language) => dispatch(getChapters(language)),
        handleSubmitForm: (payload, navigation, action) =>
            dispatch(submitTeacherGift(payload, navigation, action)),
        handleCleanUp: () => dispatch(cleanUp()),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(TeacherGift);
