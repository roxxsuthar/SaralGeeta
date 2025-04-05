import React, { useEffect, useState, useCallback } from 'react';
import { AppState } from 'react-native';

const withAppState = (WrappedComponent) => (props) => {
  const [appState, updateAppState] = useState(AppState.currentState);

  const handleAppStateChange = useCallback(
    (nextAppState) => {
      updateAppState(nextAppState);
    },
    [appState],
  );

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => AppState.removeEventListener('change', handleAppStateChange);
  }, []);

  return <WrappedComponent {...props} appState={appState} />;
};

export default withAppState;
