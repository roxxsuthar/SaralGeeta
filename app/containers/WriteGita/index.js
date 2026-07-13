import React, { memo, useEffect } from 'react';
import { View, StatusBar, ImageBackground, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import strings from '../../../i18n';

import styles from './styles';
import { COLORS, IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import { hp } from '../../utils/responsive';
import { Navigation } from '../../constants/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import makeSelectWriteGita from './selectors';
import { getRules, submitWriteGita, cleanUp } from './actions';
import LoadingScreen from '../../components/LoadingScreen';
import SuccessModal from '../../components/SuccessModal';
import ConfirmModal from '../../components/ConfirmModal';

function WriteGita({ writeGita, appLanguage, handleGetRules, handleSubmitForm, handleCleanUp }) {
    strings.setLanguage(appLanguage);
    const navigation = useNavigation();
    const { writeGita: writeGitaStrings } = strings;
    const [showModal, setShowModal] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [formActions, setFormActions] = React.useState(null);
    const [tempValues, setTempValues] = React.useState(null);

    useEffect(() => {
        handleGetRules(appLanguage);
        return () => {
            handleCleanUp();
        };
    }, [handleGetRules, handleCleanUp, appLanguage]);

    useEffect(() => {
        if (writeGita?.success && !writeGita?.loading) {
            setTimeout(() => {
                setShowModal(true);
            }, 500);
        }
    }, [writeGita?.success, writeGita?.loading]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]+$/, 'Must be only digits')
            .min(10, 'Must be at least 10 digits')
            .required('Phone number is required'),
        address: Yup.string().required('Address is required'),
        granths: Yup.string().required('Please select at least one rule'),
    });

    const rules = writeGita?.rules || [];

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
                        {writeGitaStrings?.heading?.defaultMessage || 'Write Gita'}
                    </CustomText>
                    <View style={{ width: 40 }} />
                </View>

                {writeGita?.loading === false && (
                    <View style={styles.mainContainer}>
                        <Formik
                            initialValues={{
                                name: '',
                                phoneNumber: '',
                                address: '',
                                granths: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, action) => {
                                setFormActions(action);
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
                                        contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(40) }}
                                        keyboardShouldPersistTaps="handled"
                                    >
                                        <View style={styles.introContainer}>
                                            <CustomText style={styles.description}>
                                                {writeGitaStrings?.description?.defaultMessage || 'Write Gita Campaign Description'}
                                            </CustomText>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <CustomText style={styles.label}>
                                                {writeGitaStrings?.name?.defaultMessage || 'Name'}
                                            </CustomText>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={writeGitaStrings?.placeholderName?.defaultMessage || "Enter your name"}
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
                                                {writeGitaStrings?.phoneNumber?.defaultMessage || 'Contact'}
                                            </CustomText>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={writeGitaStrings?.placeholderPhone?.defaultMessage || "Enter your contact number"}
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
                                                {writeGitaStrings?.address?.defaultMessage || 'Address'}
                                            </CustomText>
                                            <TextInput
                                                style={styles.textarea}
                                                placeholder={writeGitaStrings?.placeholderAddress?.defaultMessage || "Enter your full address"}
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


                                        <View style={styles.rulesListContainer}>
                                            <CustomText style={styles.label}>
                                                {writeGitaStrings?.rulesLabel?.defaultMessage || 'Select Rules'}
                                            </CustomText>
                                            {rules.map((rule) => (
                                                <TouchableOpacity
                                                    key={rule?.id}
                                                    style={styles.ruleItem}
                                                    onPress={() => {
                                                        setFieldValue('granths', rule?.id);
                                                    }}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={[
                                                        styles.checkbox,
                                                        values.granths === rule?.id && styles.checkboxChecked
                                                    ]}>
                                                        {values.granths === rule?.id && (
                                                            <View style={{ width: 8, height: 8, backgroundColor: 'white', borderRadius: 4 }} />
                                                        )}
                                                    </View>
                                                    <CustomText style={[
                                                        styles.ruleName,
                                                        values.granths === rule?.id && { color: COLORS.orange, fontFamily: 'Outfit-Bold' }
                                                    ]}>{rule?.name}</CustomText>
                                                </TouchableOpacity>
                                            ))}
                                            {touched.granths && errors.granths && (
                                                <CustomText style={styles.errorText}>{errors.granths}</CustomText>
                                            )}
                                        </View>
                                    </ScrollView>

                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={handleSubmit}
                                            disabled={writeGita?.loading}
                                        >
                                            <CustomText style={styles.buttonText}>
                                                {writeGitaStrings?.button?.defaultMessage || 'Submit'}
                                            </CustomText>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </Formik>
                    </View>
                )}
                {writeGita?.loading && <LoadingScreen />}
                <SuccessModal
                    visible={showModal}
                    message={writeGitaStrings?.successMessage?.defaultMessage || 'We will connect with you shortly.'}
                    buttonText={writeGitaStrings?.okButton?.defaultMessage || 'Ok'}
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
                <ConfirmModal
                    visible={showConfirmModal}
                    title={writeGitaStrings?.alertTitle?.defaultMessage || 'Confirmation'}
                    message={writeGitaStrings?.alertMessage?.defaultMessage || 'Have you entered correct address?'}
                    cancelText={writeGitaStrings?.alertNo?.defaultMessage || 'No'}
                    confirmText={writeGitaStrings?.alertYes?.defaultMessage || 'Yes'}
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={() => {
                        setShowConfirmModal(false);
                        setTimeout(() => {
                            handleSubmitForm(tempValues, navigation, formActions);
                        }, 500);
                    }}
                />
            </SafeAreaView>
        </ImageBackground>
    );
}

WriteGita.propTypes = {
    writeGita: PropTypes.object,
    appLanguage: PropTypes.string,
    handleGetRules: PropTypes.func,
    handleSubmitForm: PropTypes.func,
    handleCleanUp: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
    writeGita: makeSelectWriteGita(),
    appLanguage: (state) => state.app?.language?.currentLanguage,
});

function mapDispatchToProps(dispatch) {
    return {
        handleGetRules: (language) => dispatch(getRules(language)),
        handleSubmitForm: (payload, navigation, action) =>
            dispatch(submitWriteGita(payload, navigation, action)),
        handleCleanUp: () => dispatch(cleanUp()),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(WriteGita);
