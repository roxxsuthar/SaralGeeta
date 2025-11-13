import * as React from 'react';

export const isReadyRef = React.createRef();
export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    // Wrap in try-catch to handle navigation errors
    try {
      navigationRef.current.navigate(name, params);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }
}

export function goBack() {
  if (isReadyRef.current && navigationRef.current) {
    try {
      const canGoBack = navigationRef.current.canGoBack();
      if (canGoBack) {
        navigationRef.current.goBack();
        return true;
      }
    } catch (error) {
      console.error('Navigation back error:', error);
    }
  }
  return false;
}

export function resetRoot(state) {
  if (isReadyRef.current && navigationRef.current) {
    try {
      navigationRef.current.resetRoot(state);
    } catch (error) {
      console.error('Navigation reset error:', error);
    }
  }
}
