import React, {useState, useEffect, useCallback} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import isEqual from 'lodash/isEqual';

import {OS} from './device';
import {COLORS} from '../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.emoWhite,
  },
});

const useIsFloatingKeyboard = () => {
  const [isFloating, setFloating] = useState(false);

  const windowWidth = Dimensions.get('window').width;

  const onKeyboardWillChangeFrame = useCallback(
    event => {
      setFloating(event.endCoordinates.width !== windowWidth);
    },
    [windowWidth],
  );

  useEffect(() => {
    if (isEqual(OS, 'ios')) {
      const keyboardListener = Keyboard.addListener(
        'keyboardWillChangeFrame',
        onKeyboardWillChangeFrame,
      );

      return () => {
        keyboardListener.remove();
      };
    }
  }, [onKeyboardWillChangeFrame]);

  return isFloating;
};

function WithKeyboardAvoidingView({children, ...props}) {
  const isFloatingKeyboard = useIsFloatingKeyboard();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={isEqual(OS, 'ios') && 'padding'}
      enabled={!isFloatingKeyboard && isEqual(OS, 'ios')}
      {...props}>
      {children}
    </KeyboardAvoidingView>
  );
}

WithKeyboardAvoidingView.propTypes = {
  ...WithKeyboardAvoidingView,
};

export default WithKeyboardAvoidingView;
