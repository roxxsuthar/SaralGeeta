import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CopilotProvider, CopilotStep, walkthroughable, useCopilot } from 'react-native-copilot';

import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';

const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);
const CopilotTextInput = walkthroughable(TextInput);
import LinearGradient from 'react-native-linear-gradient';
import Lottie from 'lottie-react-native';
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
import { getQuestions, submitAnswers, resetSubmit } from './actions';
import { useBhagwanRecording } from './hooks/useBhagwanRecording';
import strings from '../../../i18n';

function BhagwanQuestions({
  bhagwanQuestions,
  appLanguage,
  handleGetQuestions,
  handleSubmitAnswers,
  handleResetSubmit,
}) {
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
      } catch (e) { }
    };
    checkTutorial();
  }, []);

  useEffect(() => {
    const handleStop = () => {
      AsyncStorage.setItem('HAS_SEEN_BHAGWAN_TUTORIAL', 'true').catch(() => { });
    };
    copilotEventsRef.current.on('stop', handleStop);
    return () => {
      copilotEventsRef.current.off('stop', handleStop);
    };
  }, []);

  const {
    isRecording,
    audioPath,
    startRecording,
    stopRecording,
    clearAudio,
    setAudioPath,
  } = useBhagwanRecording();

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
      if (currentIndex < data.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setAudioPath(answers[data[nextIndex].id] || null);
        handleResetSubmit();
      } else {
        Alert.alert(
          strings.bhagwanQuestions.successTitle.defaultMessage,
          strings.bhagwanQuestions.successMessage.defaultMessage,
          [{
            text: 'OK', onPress: () => {
              handleResetSubmit();
              navigation.goBack();
            }
          }],
        );
      }
    }
    if (submitError) {
      Alert.alert(
        strings.bhagwanQuestions.errorTitle.defaultMessage,
        strings.bhagwanQuestions.errorMessage.defaultMessage,
        [{ text: 'OK', onPress: () => handleResetSubmit() }],
      );
    }
  }, [submitSuccess, submitError, currentIndex, data, answers, handleResetSubmit, navigation, setAudioPath]);

  useEffect(() => {
    return () => {
      handleResetSubmit();
    };
  }, [handleResetSubmit]);

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
  const hasAnswer = !!audioPath;

  const handleStopRecording = async () => {
    const filePath = await stopRecording();
    if (filePath && currentQuestion) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: filePath }));
    }
  };

  const handleClearAudio = () => {
    clearAudio();
    if (currentQuestion) {
      setAnswers((prev) => {
        const next = { ...prev };
        delete next[currentQuestion.id];
        return next;
      });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setAudioPath(answers[data[prevIndex].id] || null);
    } else {
      navigation.goBack();
    }
  };

  const handleNext = () => {
    if (!data || data.length === 0) return;
    if (!audioPath) {
      Alert.alert('Info', 'Please record your answer first');
      return;
    }

    handleSubmitAnswers([
      {
        questionId: currentQuestion.id,
        answer: audioPath,
      },
    ]);
  };

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


          {/* Answer recording interface */}
          {isRecording ? (
            <View style={styles.recordingContainer}>
              <TouchableOpacity
                style={[styles.micButton, styles.micButtonActive]}
                onPress={handleStopRecording}
                activeOpacity={0.8}
              >
                <IMAGES.PauseIcon height={28} width={28} />
              </TouchableOpacity>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Lottie
                  source={IMAGES.PlayerLottie}
                  autoPlay
                  loop
                  style={{ width: 80, height: 30 }}
                />
                <CustomText style={[styles.recordingStatusText, { marginLeft: 4 }]}>
                  Recording...
                </CustomText>
              </View>
            </View>
          ) : (
            <View style={styles.recordingContainer}>
              <TouchableOpacity
                style={styles.micButton}
                onPress={startRecording}
                activeOpacity={0.8}
              >
                <IMAGES.MicIcon height={30} width={30} />
              </TouchableOpacity>
              <CustomText style={styles.recordingStatusText}>
                {audioPath
                  ? 'Answer Recorded Successfully'
                  : 'Tap microphone to record answer'}
              </CustomText>
              {!!audioPath && (
                <TouchableOpacity onPress={handleClearAudio} style={styles.clearBtn}>
                  <CustomText style={styles.clearBtnTxt}>🗑️</CustomText>
                </TouchableOpacity>
              )}
            </View>
          )}

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
                        {strings.bhagwanQuestions.nextBtn.defaultMessage}
                      </CustomText>
                      <CustomText style={styles.arrowTxt}> →</CustomText>
                    </>
                  )}
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
  handleResetSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  bhagwanQuestions: makeSelectBhagwanQuestions(),
  appLanguage: (state) => state.app?.language?.currentLanguage,
});

function mapDispatchToProps(dispatch) {
  return {
    handleGetQuestions: () => dispatch(getQuestions()),
    handleSubmitAnswers: (payload) => dispatch(submitAnswers(payload)),
    handleResetSubmit: () => dispatch(resetSubmit()),
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
