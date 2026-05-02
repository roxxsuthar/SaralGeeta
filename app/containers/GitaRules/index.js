/**
 *
 * GitaRules
 *
 */

import React, { memo, useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { DrawerActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import { TextInput } from 'react-native-gesture-handler';
import * as Yup from 'yup';

import makeSelectGitaRules from './selectors';
import styles from './styles';
import { COLORS, IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import strings from '../../../i18n';
import { getGitaRules, submitGitaRules, cleanUp } from './actions';
import LoadingScreen from '../../components/LoadingScreen';
import SuccessModal from '../../components/SuccessModal';
import ConfirmModal from '../../components/ConfirmModal';
import { SafeAreaView } from 'react-native-safe-area-context';

function GitaRules({ gitaRules, appLanguage, handleGetRules, handleSubmitForm, handleCleanUp }) {
    strings.setLanguage(appLanguage);
    const { gitaRules: gitaRulesStrings } = strings;
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [formActions, setFormActions] = useState(null);
    const [tempValues, setTempValues] = useState(null);

    useFocusEffect(
        useCallback(() => {
            handleGetRules(appLanguage);
            return () => {
                handleCleanUp();
            };
        }, [handleGetRules, handleCleanUp, appLanguage])
    );

    useEffect(() => {
        if (gitaRules.submitSuccess && !gitaRules.submitLoading) {
            setShowModal(true);
        }
    }, [gitaRules.submitSuccess, gitaRules.submitLoading]);

    const validationSchema = Yup.object().shape({
        rule: Yup.array().min(1, 'Please select at least one rule'),
        user_input: Yup.string().required('Please enter your response'),
    });

    const handleSubmitPress = (values, action) => {
        setTempValues(values);
        setFormActions(action);
        setShowConfirmModal(true);
    };

    const rulesData = gitaRules.rules || [];

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
                        {gitaRulesStrings?.heading?.defaultMessage || 'Gita Rules'}
                    </CustomText>
                    <View style={{ width: 40 }} />
                </View>

                {gitaRules?.loading ? (
                    <LoadingScreen />
                ) : (
                    <View style={styles.mainContainer}>
                        <View style={styles.introContainer}>
                            <CustomText style={styles.subHeading}>
                                {gitaRulesStrings?.subHeading?.defaultMessage || 'Follow the path of Gita'}
                            </CustomText>
                            <CustomText style={styles.description}>
                                {gitaRulesStrings?.description?.defaultMessage || 'By following these rules, you align yourself with the teachings of Bhagavad Gita.'}
                            </CustomText>
                        </View>

                        <Formik
                            initialValues={{
                                rule: [],
                                user_input: '',
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
                                        style={styles.rulesList}
                                    >
                                        <View style={styles.inputContainer}>
                                            <CustomText style={styles.label}>
                                                {gitaRulesStrings?.inputLabel?.defaultMessage || 'Your Response'}
                                            </CustomText>
                                            <TextInput
                                                style={styles.textarea}
                                                placeholder={gitaRulesStrings?.inputPlaceholder?.defaultMessage || "Enter your input here..."}
                                                placeholderTextColor={COLORS.gray}
                                                multiline
                                                onChangeText={handleChange('user_input')}
                                                onBlur={handleBlur('user_input')}
                                                value={values.user_input}
                                                allowFontScaling={false}
                                            />
                                            {touched.user_input && errors.user_input && (
                                                <CustomText style={styles.errorText}>{errors.user_input}</CustomText>
                                            )}
                                        </View>

                                        <View style={{ marginBottom: 15 }}>
                                            <CustomText style={styles.label}>
                                                {gitaRulesStrings?.rulesLabel?.defaultMessage || 'Select a Rule'}
                                            </CustomText>
                                        </View>
                                        {rulesData.map((rule) => (
                                            <TouchableOpacity
                                                key={rule.id}
                                                style={styles.ruleItem}
                                                onPress={() => {
                                                    const currentRules = values.rule || [];
                                                    const nextRules = currentRules.includes(rule.id)
                                                        ? currentRules.filter((id) => id !== rule.id)
                                                        : [...currentRules, rule.id];
                                                    setFieldValue('rule', nextRules);
                                                }}
                                                activeOpacity={0.7}
                                            >
                                                <View style={[
                                                    styles.checkbox,
                                                    values.rule.includes(rule.id) && styles.checkboxChecked
                                                ]}>
                                                    {values.rule.includes(rule.id) && (
                                                        <View style={{ width: 12, height: 12, backgroundColor: 'white', borderRadius: 2 }} />
                                                    )}
                                                </View>
                                                <CustomText style={[
                                                    styles.ruleText,
                                                    values.rule.includes(rule.id) && styles.ruleTextChecked
                                                ]}>
                                                    {rule?.title}
                                                </CustomText>
                                            </TouchableOpacity>
                                        ))}
                                        {touched.rule && errors.rule && (
                                            <CustomText style={styles.errorText}>{errors.rule}</CustomText>
                                        )}
                                    </ScrollView>

                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={handleSubmit}
                                            disabled={gitaRules.submitLoading}
                                        >
                                            <CustomText style={styles.buttonText}>
                                                {gitaRulesStrings?.button?.defaultMessage || 'Submit'}
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
                    message={gitaRulesStrings?.successMessage?.defaultMessage || 'Your rules selection has been submitted successfully.'}
                    buttonText={gitaRulesStrings?.okButton?.defaultMessage || 'Ok'}
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
                    title={gitaRulesStrings?.alertTitle?.defaultMessage || 'Confirmation'}
                    message={gitaRulesStrings?.alertMessage?.defaultMessage || 'Are you sure you want to submit these rules?'}
                    cancelText={gitaRulesStrings?.alertNo?.defaultMessage || 'No'}
                    confirmText={gitaRulesStrings?.alertYes?.defaultMessage || 'Yes'}
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={() => {
                        setShowConfirmModal(false);
                        handleSubmitForm(tempValues, navigation);
                    }}
                />
            </SafeAreaView>
        </ImageBackground>
    );
}

GitaRules.propTypes = {
    gitaRules: PropTypes.object,
    appLanguage: PropTypes.string,
    handleGetRules: PropTypes.func,
    handleSubmitForm: PropTypes.func,
    handleCleanUp: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
    gitaRules: makeSelectGitaRules(),
    appLanguage: (state) => state.app?.language?.currentLanguage,
});

function mapDispatchToProps(dispatch) {
    return {
        handleGetRules: (language) => dispatch(getGitaRules(language)),
        handleSubmitForm: (payload, navigation) =>
            dispatch(submitGitaRules(payload, navigation)),
        handleCleanUp: () => dispatch(cleanUp()),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(GitaRules);
