import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CopilotProvider, CopilotStep, walkthroughable, useCopilot } from 'react-native-copilot';

const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);
const CopilotTextInput = walkthroughable(TextInput);

import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

import { IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import styles from './styles';
import makeSelectBhagwanQuestions from './selectors';
import { getQuestions, submitAnswers } from './actions';
import strings from '../../../i18n';

function BhagwanQuestions({ bhagwanQuestions, appLanguage, handleGetQuestions, handleSubmitAnswers }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { data, loading, submitting, submitSuccess, submitError } = bhagwanQuestions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const { start, copilotEvents } = useCopilot();
  const hasStartedGuide = useRef(false);
  const startRef = useRef(start);
  const copilotEventsRef = useRef(copilotEvents);

  startRef.current = start;
  copilotEventsRef.current = copilotEvents;

  useEffect(() => {
    const checkTutorial = async () => {
      if (hasStartedGuide.current) return;
      try {
        await AsyncStorage.removeItem('HAS_SEEN_HOME_TUTORIAL');
        await AsyncStorage.removeItem('HAS_SEEN_SHLOKS_TUTORIAL');
        await AsyncStorage.removeItem('HAS_SEEN_LEARNGEETA_TUTORIAL');
        await AsyncStorage.removeItem('HAS_SEEN_BHAGWAN_TUTORIAL');
        const hasSeen = await AsyncStorage.getItem('HAS_SEEN_BHAGWAN_TUTORIAL');
        if (!hasSeen) {
          hasStartedGuide.current = true;
          setTimeout(() => {
            startRef.current();
          }, 1500);
        }
      } catch (e) {}
    };
    checkTutorial();
  }, []);

  useEffect(() => {
    const handleStop = () => {
      AsyncStorage.setItem('HAS_SEEN_BHAGWAN_TUTORIAL', 'true').catch(() => {});
    };
    copilotEventsRef.current.on('stop', handleStop);
    return () => {
      copilotEventsRef.current.off('stop', handleStop);
    };
  }, []);

  useEffect(() => {
    if (appLanguage) {
      strings.setLanguage(appLanguage);
    }
  }, [appLanguage]);

  useEffect(() => {
    StatusBar.setHidden(false);
    StatusBar.setBarStyle('light-content');
    handleGetQuestions();
  }, [handleGetQuestions]);

  useEffect(() => {
    if (submitSuccess) {
      Alert.alert(
        strings.bhagwanQuestions.successTitle.defaultMessage,
        strings.bhagwanQuestions.successMessage.defaultMessage,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    }
    if (submitError) {
      Alert.alert(
        strings.bhagwanQuestions.errorTitle.defaultMessage,
        strings.bhagwanQuestions.errorMessage.defaultMessage,
      );
    }
  }, [submitSuccess, submitError, navigation]);

  const saveCurrentAnswer = () => {
    if (!data || data.length === 0) return {};
    const current = data[currentIndex];
    return { ...answers, [current.id]: currentAnswer };
  };

  const handleNext = () => {
    if (!data || data.length === 0) return;
    if (!currentAnswer || currentAnswer.trim() === '') return;

    const newAnswers = saveCurrentAnswer();
    setAnswers(newAnswers);

    if (currentIndex < data.length - 1) {
      const nextQ = data[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer(newAnswers[nextQ.id] || '');
    } else {
      const payload = Object.keys(newAnswers).map(qId => ({
        questionId: qId,
        answer: newAnswers[qId],
      }));
      handleSubmitAnswers(payload);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const newAnswers = saveCurrentAnswer();
      setAnswers(newAnswers);
      const prevQ = data[currentIndex - 1];
      setCurrentIndex(currentIndex - 1);
      // Restore previously typed answer for that question
      setCurrentAnswer(newAnswers[prevQ.id] || '');
    } else {
      navigation.goBack();
    }
  };

  const handleNextNav = () => {
    if (!data || data.length === 0) return;
    if (!currentAnswer || currentAnswer.trim() === '') return;

    const newAnswers = saveCurrentAnswer();
    setAnswers(newAnswers);
    if (currentIndex < data.length - 1) {
      const nextQ = data[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      // Restore previously typed answer for that question
      setCurrentAnswer(newAnswers[nextQ.id] || '');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c9a84c" />
      </View>
    );
  }

  const currentQuestion = data && data.length > 0 ? data[currentIndex] : null;
  const isLast = data && currentIndex === data.length - 1;
  const hasPrev = currentIndex > 0;
  // Disable Next/Submit whenever the current answer field is empty
  const hasAnswer = !!(currentAnswer && currentAnswer.trim() !== '');

  const getQuestionText = (item) => {
    if (!item) return strings.bhagwanQuestions.noQuestions.defaultMessage;
    if (item.id === 'mock-1') return strings.bhagwanQuestions.mockQuestion1.defaultMessage;
    if (item.id === 'mock-2') return strings.bhagwanQuestions.mockQuestion2.defaultMessage;
    if (item.id === 'mock-3') return strings.bhagwanQuestions.mockQuestion3.defaultMessage;
    return item.question;
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* ── Full-screen Krishna background ── */}
      <Image
        source={IMAGES.BhagwanQuestionsBg}
        style={styles.bgImage}
        resizeMode="cover"
      />

      {/* ── Dark gradient overlay on bottom ~55% ── */}
      <LinearGradient
        colors={['transparent', 'rgba(10,22,60,0.55)', '#102046', '#102046']}
        locations={[0, 0.28, 0.52, 1]}
        style={styles.overlay}
        pointerEvents="none"
      />

      {/* ── Back button ── */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + 10 }]}
        onPress={handleBack}
        activeOpacity={0.8}
      >
        <IMAGES.WhiteArrowIcon height={22} width={22} />
      </TouchableOpacity>

      {/* ── Main content pinned to bottom ── */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Cloud bubble — uses the actual cloud image */}
        <View style={styles.cloudOuter}>
          <ImageBackground
            source={IMAGES.CloudContainer}
            style={styles.cloudImgBg}
            resizeMode="contain"
          >
            <View style={styles.cloudImgContent}>
              {/* Question text overlaid in the center of the cloud */}
              <CustomText style={styles.questionText}>
                {getQuestionText(currentQuestion)}
              </CustomText>
            </View>
          </ImageBackground>
        </View>

        {/* ── Dark bottom panel ── */}
        <View style={[styles.bottomPanel, { paddingBottom: insets.bottom + 20 }]}>
          {/* Counter */}
          {data && data.length > 0 && (
            <CustomText style={styles.counter}>
              {strings.bhagwanQuestions.questionCounter.defaultMessage
                .replace('{currentIndex}', currentIndex + 1)
                .replace('{total}', data.length)}
            </CustomText>
          )}

          {/* Answer input */}
          <View style={styles.inputRow}>
            <CustomText style={styles.pencil}>✏️</CustomText>
            <CopilotStep
              text={strings.Copilot.bhagwanAnswerInput.defaultMessage}
              order={1}
              name="answerInput"
            >
              <CopilotTextInput
                style={styles.input}
                multiline
                placeholder={strings.bhagwanQuestions.placeholder.defaultMessage}
                placeholderTextColor="rgba(255,255,255,0.38)"
                value={currentAnswer}
                onChangeText={setCurrentAnswer}
              />
            </CopilotStep>
          </View>

          {/* Navigation row: Prev ←  →  Submit/Next */}
          <View style={styles.navRow}>
            {/* Prev button — always visible, grayed if on first question */}
            <CopilotStep
              text={strings.Copilot.bhagwanPrevBtn.defaultMessage}
              order={2}
              name="prevBtn"
            >
              <CopilotTouchableOpacity
                style={[styles.navBtn, !hasPrev && styles.navBtnDisabled]}
                onPress={handleBack}
                disabled={!hasPrev}
                activeOpacity={0.8}
              >
                <CustomText style={styles.navBtnTxt}>
                  {strings.bhagwanQuestions.prevBtn.defaultMessage}
                </CustomText>
              </CopilotTouchableOpacity>
            </CopilotStep>

            {/* Submit / Next button */}
            {isLast ? (
              <CopilotStep
                text={strings.Copilot.bhagwanSubmitBtn.defaultMessage}
                order={3}
                name="submitBtn"
              >
                <CopilotTouchableOpacity
                  style={[styles.submitBtn, (!hasAnswer || submitting) && styles.navBtnDisabled]}
                  onPress={handleNext}
                  disabled={!hasAnswer || submitting}
                  activeOpacity={0.85}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <CustomText style={styles.submitTxt}>
                        {strings.bhagwanQuestions.submitBtn.defaultMessage}
                      </CustomText>
                      <CustomText style={styles.arrowTxt}> →</CustomText>
                    </>
                  )}
                </CopilotTouchableOpacity>
              </CopilotStep>
            ) : (
              <CopilotStep
                text={strings.Copilot.bhagwanSubmitBtn.defaultMessage}
                order={3}
                name="submitBtn"
              >
                <CopilotTouchableOpacity
                  style={[styles.submitBtn, !hasAnswer && styles.navBtnDisabled]}
                  onPress={handleNextNav}
                  disabled={!hasAnswer}
                  activeOpacity={0.85}
                >
                  <CustomText style={styles.submitTxt}>
                    {strings.bhagwanQuestions.nextBtn.defaultMessage}
                  </CustomText>
                  <CustomText style={styles.arrowTxt}> →</CustomText>
                </CopilotTouchableOpacity>
              </CopilotStep>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

BhagwanQuestions.propTypes = {
  bhagwanQuestions: PropTypes.object.isRequired,
  appLanguage: PropTypes.string,
  handleGetQuestions: PropTypes.func.isRequired,
  handleSubmitAnswers: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  bhagwanQuestions: makeSelectBhagwanQuestions(),
  appLanguage: (state) => state.app?.language?.currentLanguage,
});

function mapDispatchToProps(dispatch) {
  return {
    handleGetQuestions: () => dispatch(getQuestions()),
    handleSubmitAnswers: payload => dispatch(submitAnswers(payload)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const MemoizedBhagwanQuestions = React.memo(BhagwanQuestions);

function BhagwanQuestionsWrapper(props) {
  const currentLanguage = props.appLanguage;
  const labels = {
    previous: strings.Copilot.previous.defaultMessage,
    next: strings.Copilot.next.defaultMessage,
    skip: strings.Copilot.skip.defaultMessage,
    finish: strings.Copilot.finish.defaultMessage,
  };
  global.copilotSupportedOrientations = ['portrait'];
  return (
    <CopilotProvider
      verticalOffset={0}
      backdropColor="rgba(0, 0, 0, 0.7)"
      labels={labels}
    >
      <MemoizedBhagwanQuestions {...props} />
    </CopilotProvider>
  );
}

BhagwanQuestionsWrapper.propTypes = {
  appLanguage: PropTypes.string,
};

export default compose(withConnect)(BhagwanQuestionsWrapper);
