import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CopilotProvider, CopilotStep, walkthroughable, useCopilot } from 'react-native-copilot';

import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);
import LinearGradient from 'react-native-linear-gradient';
import { connect, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

import { IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import styles from './styles';
import makeSelectBhagwanQuestions from './selectors';
import { getQuestions, resetSubmit } from './actions';
import strings from '../../../i18n';

function BhagwanQuestions({
  bhagwanQuestions,
  appLanguage,
  handleGetQuestions,
  handleResetSubmit,
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { data, loading, error } = bhagwanQuestions;
  const accessToken = useSelector((state) => state.app?.accessToken);

  const [showAnswer, setShowAnswer] = useState(false);
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
        const hasSeen = await AsyncStorage.getItem('HAS_SEEN_BHAGWAN_TUTORIAL');
        if (!hasSeen) {
          hasStartedGuide.current = true;
          // Set it immediately so it never triggers again, even if they exit the screen early
          AsyncStorage.setItem('HAS_SEEN_BHAGWAN_TUTORIAL', 'true').catch(() => {});
          setTimeout(() => {
            startRef.current();
          }, 1500);
        }
      } catch (e) {
        return;
      }
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

  useEffect(() => {
    if (appLanguage) {
      strings.setLanguage(appLanguage);
    }
  }, [appLanguage]);

  useEffect(() => {
    StatusBar.setHidden(false);
    StatusBar.setBarStyle('light-content');
    handleGetQuestions(accessToken);
  }, [handleGetQuestions, accessToken]);

  useEffect(() => {
    if (error) {
      Alert.alert(
        strings.bhagwanQuestions.errorTitle.defaultMessage,
        error.response?.data?.message || strings.bhagwanQuestions.errorMessage.defaultMessage,
      );
    }
  }, [error]);

  useEffect(() => {
    if (data === null) {
      Alert.alert(
        strings.bhagwanQuestions.successTitle.defaultMessage,
        strings.bhagwanQuestions.successMessage.defaultMessage,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    }
  }, [data, navigation]);

  useEffect(() => {
    return () => {
      handleResetSubmit();
    };
  }, [handleResetSubmit]);

  const loadNextQuestion = () => {
    setShowAnswer(false);
    handleGetQuestions(accessToken);
  };

  const handleBack = () => navigation.goBack();

  const handleShowAnswer = () => setShowAnswer(true);

  const getQuestionText = (item) => {
    if (!item?.question) {
      return strings.bhagwanQuestions.noQuestions.defaultMessage;
    }
    if (typeof item.question === 'object') {
      return strings.bhagwanQuestions.chapterShlokeQuestion.defaultMessage
        .replace('{chapter}', String(item.question.chapter))
        .replace('{shloke}', String(item.question.shloke));
    }
    return item.question;
  };

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

  const currentQuestion = data?.data;
  const answerText = Array.isArray(currentQuestion?.answer)
    ? [
        currentQuestion.answer.slice(0, Math.ceil(currentQuestion.answer.length / 2)).join(' '),
        currentQuestion.answer.slice(Math.ceil(currentQuestion.answer.length / 2)).join(' '),
      ]
        .filter(Boolean)
        .join('\n')
    : currentQuestion?.answer || '';

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* ── Full-screen background ── */}
      <Image
        source={IMAGES.BhagwanNewBg}
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


        {/* ── Dark bottom panel ── */}
        <View style={[styles.bottomPanel, { paddingBottom: insets.bottom + 20 }]}>

          {/* Question text */}
          <CustomText style={styles.questionTextPanel}>
            {getQuestionText(currentQuestion)}
          </CustomText>
          <View style={styles.questionDivider} />

          {showAnswer && (
            <View style={styles.validatedAnswerContainer}>
              <CustomText style={styles.validatedAnswerLabel}>
                {strings.bhagwanQuestions.expectedAnswer.defaultMessage}
              </CustomText>
              <CustomText
                style={styles.validatedAnswerText}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {answerText || strings.bhagwanQuestions.noExpectedAnswer.defaultMessage}
              </CustomText>
            </View>
          )}

          <TouchableOpacity
            style={styles.validateBtn}
            onPress={handleShowAnswer}
            activeOpacity={0.85}
          >
            <CustomText style={styles.submitTxt}>
              {strings.bhagwanQuestions.validateBtn.defaultMessage}
            </CustomText>
          </TouchableOpacity>

          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <IMAGES.WhiteArrowIcon height={18} width={18} />
              <CustomText style={styles.navBtnTxt}>
                {strings.bhagwanQuestions.prevBtn.defaultMessage}
              </CustomText>
            </TouchableOpacity>

            <CopilotStep
              text={strings.Copilot.bhagwanSubmitBtn.defaultMessage}
              order={3}
              name="submitBtn"
            >
              <CopilotTouchableOpacity
                style={styles.submitBtn}
                onPress={loadNextQuestion}
                activeOpacity={0.85}
              >
                <CustomText style={styles.submitTxt}>
                  {strings.bhagwanQuestions.nextBtn.defaultMessage}
                </CustomText>
                <IMAGES.WhiteArrowIcon
                  height={18}
                  width={18}
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
              </CopilotTouchableOpacity>
            </CopilotStep>
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
    handleGetQuestions: (accessToken) => dispatch(getQuestions(accessToken)),
    handleResetSubmit: () => dispatch(resetSubmit()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const MemoizedBhagwanQuestions = React.memo(BhagwanQuestions);

function BhagwanQuestionsWrapper(props) {
  const labels = {
    previous: strings.Copilot.previous.defaultMessage,
    next: strings.Copilot.next.defaultMessage,
    skip: strings.Copilot.skip.defaultMessage,
    finish: strings.Copilot.finish.defaultMessage,
  };
  globalThis.copilotSupportedOrientations = ['portrait'];
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
