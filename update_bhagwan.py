import sys
import re

with open('app/containers/BhagwanQuestions/index.js', 'r') as f:
    content = f.read()

# 1. Imports
imports = '''import AsyncStorage from '@react-native-async-storage/async-storage';
import { CopilotProvider, CopilotStep, walkthroughable, useCopilot } from 'react-native-copilot';

const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);
const CopilotTextInput = walkthroughable(TextInput);
'''
content = content.replace("import React, { useEffect, useState } from 'react';", "import React, { useEffect, useState, useRef } from 'react';\n" + imports)

# 2. Hooks
hooks = '''  const { start, copilotEvents } = useCopilot();
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
  }, []);'''
content = content.replace("const [currentAnswer, setCurrentAnswer] = useState('');", "const [currentAnswer, setCurrentAnswer] = useState('');\n" + hooks)

# 3. Answer Input
target_input = '''        <TextInput
          style={styles.textInput}
          multiline
          placeholder={strings.bhagwanPlaceholder}
          placeholderTextColor="#999"
          value={currentAnswer}
          onChangeText={setCurrentAnswer}
          editable={!submitting}
        />'''
replacement_input = '''        <CopilotStep
          text={strings.Copilot.bhagwanAnswerInput.defaultMessage}
          order={1}
          name="answerInput"
        >
          <CopilotTextInput
            style={styles.textInput}
            multiline
            placeholder={strings.bhagwanPlaceholder}
            placeholderTextColor="#999"
            value={currentAnswer}
            onChangeText={setCurrentAnswer}
            editable={!submitting}
          />
        </CopilotStep>'''
content = content.replace(target_input, replacement_input)

# 4. Prev Button
target_prev = '''          <TouchableOpacity
            style={[styles.button, styles.prevButton]}
            onPress={handlePrev}
            disabled={currentIndex === 0 || submitting}
          >
            <CustomText style={styles.buttonText}>{strings.Previous}</CustomText>
          </TouchableOpacity>'''
replacement_prev = '''          <CopilotStep
            text={strings.Copilot.bhagwanPrevBtn.defaultMessage}
            order={2}
            name="prevBtn"
          >
            <CopilotTouchableOpacity
              style={[styles.button, styles.prevButton]}
              onPress={handlePrev}
              disabled={currentIndex === 0 || submitting}
            >
              <CustomText style={styles.buttonText}>{strings.Previous}</CustomText>
            </CopilotTouchableOpacity>
          </CopilotStep>'''
content = content.replace(target_prev, replacement_prev)

# 5. Next Button
target_next = '''          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={handleNext}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <CustomText style={styles.buttonText}>
                {currentIndex === data.length - 1 ? strings.Submit : strings.Next}
              </CustomText>
            )}
          </TouchableOpacity>'''
replacement_next = '''          <CopilotStep
            text={strings.Copilot.bhagwanSubmitBtn.defaultMessage}
            order={3}
            name="submitBtn"
          >
            <CopilotTouchableOpacity
              style={[styles.button, styles.nextButton]}
              onPress={handleNext}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <CustomText style={styles.buttonText}>
                  {currentIndex === data.length - 1 ? strings.Submit : strings.Next}
                </CustomText>
              )}
            </CopilotTouchableOpacity>
          </CopilotStep>'''
content = content.replace(target_next, replacement_next)

# 6. Wrapper
target_export = 'export default compose(withConnect)(BhagwanQuestions);'
replacement_export = '''const MemoizedBhagwanQuestions = React.memo(BhagwanQuestions);

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
    <CopilotProvider verticalOffset={0} backdropColor="rgba(0, 0, 0, 0.7)" labels={labels}>
      <MemoizedBhagwanQuestions {...props} />
    </CopilotProvider>
  );
}

BhagwanQuestionsWrapper.propTypes = {
  appLanguage: PropTypes.string,
};

export default compose(withConnect)(BhagwanQuestionsWrapper);'''
content = content.replace(target_export, replacement_export)

with open('app/containers/BhagwanQuestions/index.js', 'w') as f:
    f.write(content)
