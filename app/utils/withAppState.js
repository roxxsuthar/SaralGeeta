import React, { useEffect, useState, useCallback } from 'react';
import { AppState } from 'react-native';

const withAppState = (WrappedComponent) => {
  const WithAppState = (props) => {
    const [appState, updateAppState] = useState(AppState.currentState);

    const handleAppStateChange = useCallback(
      (nextAppState) => {
        updateAppState(nextAppState);
      },
      [appState],
    );

    useEffect(() => {
      const subscription = AppState.addEventListener(
        'change',
        handleAppStateChange,
      );

      return () => {
        if (subscription?.remove) {
          subscription.remove();
        }
      };
    }, []);
    return <WrappedComponent {...props} appState={appState} />;
  };

  WithAppState.displayName = `withAppState(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAppState;
};

export default withAppState;
