import React, { useEffect, useState, useCallback } from 'react';
import { AppState } from 'react-native';

const withAppState = (WrappedComponent) => {
  const WithAppStateComponent = (props) => {
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

  WithAppStateComponent.displayName = `withAppState(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAppStateComponent;
};

export default withAppState;
