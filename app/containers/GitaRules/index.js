/**
 *
 * GitaRules
 *
 */

import React, { memo, useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, ImageBackground, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
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
import { getGitaRules, submitGitaRules, cleanUp, getRulesStats } from './actions';
import LoadingScreen from '../../components/LoadingScreen';
import SuccessModal from '../../components/SuccessModal';
import ConfirmModal from '../../components/ConfirmModal';
import { SafeAreaView } from 'react-native-safe-area-context';


function GitaRules({ gitaRules, appLanguage, handleGetRules, handleSubmitForm, handleCleanUp, handleGetRulesStats }) {
    strings.setLanguage(appLanguage);
    const { gitaRules: gitaRulesStrings } = strings;
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
    const [formActions, setFormActions] = useState(null);
    const [tempValues, setTempValues] = useState(null);

    const openStatsModal = () => {
        setIsStatsModalVisible(true);
        handleGetRulesStats();
    };

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
    });

    const handleSubmitPress = (values, action) => {
        setTempValues(values);
        setFormActions(action);
        setShowConfirmModal(true);
    };

    const rulesData = gitaRules.rules || [];

    const isToday = (dateString) => {
        if (!dateString) return false;
        try {
            const today = new Date().toISOString().split('T')[0];
            const date = new Date(dateString).toISOString().split('T')[0];
            return today === date;
        } catch (e) {
            return false;
        }
    };

    const getInitialValues = () => {
        const submittedRuleIds = (gitaRules.rules || [])
            .filter(rule => rule.user_input === 'Yes' || rule.is_submitted_today)
            .map(rule => rule.id);

        if (submittedRuleIds.length > 0) {
            return {
                rule: submittedRuleIds,
            };
        }

        const selected = gitaRules.selectedToday;
        if (selected && isToday(selected.created_at || selected.updated_at)) {
            let ruleIds = [];
            if (Array.isArray(selected.rule)) {
                ruleIds = selected.rule.map(r => typeof r === 'object' ? r.id : r);
            } else if (selected.rule) {
                ruleIds = [typeof selected.rule === 'object' ? selected.rule.id : selected.rule];
            }

            return {
                rule: ruleIds,
            };
        }
        return {
            rule: [],
        };
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
            <SafeAreaView style={styles.container} edges={['top']}>
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
                        {gitaRulesStrings?.heading?.defaultMessage || 'Gita Rules'}
                    </CustomText>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.iconContainer}
                        onPress={openStatsModal}
                    >
                        <View style={styles.icon}>
                            <IMAGES.InfoWhiteIcon height="100%" width="100%" />
                        </View>
                    </TouchableOpacity>
                </View>

                {gitaRules?.loading || gitaRules?.submitLoading ? (
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
                            <CustomText style={[styles.description, { marginTop: 10 }]}>
                                {gitaRulesStrings?.instructions?.defaultMessage || 'Click on the rules you have followed today and submit. You must do this every day. You can view your report every month to see which rules you have followed and which you have missed.'}
                            </CustomText>
                        </View>

                        <Formik
                            enableReinitialize
                            initialValues={getInitialValues()}
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
                                                    values.rule?.includes(rule.id) && styles.checkboxChecked
                                                ]}>
                                                    {values.rule?.includes(rule.id) && (
                                                        <View style={{ width: 12, height: 12, backgroundColor: 'white', borderRadius: 2 }} />
                                                    )}
                                                </View>
                                                <CustomText style={[
                                                    styles.ruleText,
                                                    values.rule?.includes(rule.id) && styles.ruleTextChecked
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

                <Modal
                    transparent
                    visible={isStatsModalVisible}
                    animationType="fade"
                    onRequestClose={() => setIsStatsModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <CustomText style={styles.modalTitle}>
                                {gitaRulesStrings?.statsTitle?.defaultMessage || 'Monthly Rule Follow Sheet'}
                            </CustomText>
                            
                            {gitaRules?.statsLoading ? (
                                <View style={{ paddingVertical: 40 }}>
                                    <ActivityIndicator size="large" color={COLORS.orange} />
                                </View>
                            ) : (
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {(gitaRules?.stats || []).length > 0 ? (
                                        gitaRules.stats.map((stat, index) => (
                                            <View key={stat.rule_id || index} style={styles.statsItem}>
                                                <CustomText style={styles.statsTitle}>{stat.title}</CustomText>
                                                <View style={styles.statsCountContainer}>
                                                    <CustomText style={styles.statsCount}>{stat.Count} Days</CustomText>
                                                </View>
                                            </View>
                                        ))
                                    ) : (
                                        <CustomText style={{ textAlign: 'center', marginVertical: 20, color: COLORS.black }}>
                                            {gitaRulesStrings?.noStatsData?.defaultMessage || 'No statistics available for this month.'}
                                        </CustomText>
                                    )}
                                </ScrollView>
                            )}
                            
                            <TouchableOpacity
                                style={styles.closeModalButton}
                                activeOpacity={0.8}
                                onPress={() => setIsStatsModalVisible(false)}
                            >
                                <CustomText style={styles.closeModalButtonText}>
                                    {gitaRulesStrings?.close?.defaultMessage || 'Close'}
                                </CustomText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
    handleGetRulesStats: PropTypes.func,
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
        handleGetRulesStats: () => dispatch(getRulesStats()),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(GitaRules);
