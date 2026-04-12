/* eslint-disable no-undef */
import 'react-native-gesture-handler'; // FIRST
import 'react-native-reanimated';
import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, TextInput } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { enableScreens } from 'react-native-screens';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';

import SaralGeetaApp from './app/containers/App';
import configureStore from './configureStore';

enableScreens(true);

if (Text.defaultProps) {
  Text.defaultProps.allowFontScaling = false;
} else {
  Text.defaultProps = {
    allowFontScaling: false,
  };
}

if (TextInput.defaultProps) {
  TextInput.defaultProps.allowFontScaling = false;
} else {
  TextInput.defaultProps = {
    allowFontScaling: false,
  };
}


const { store, persistor } = configureStore();

function App() {
  const isDarkMode = useColorScheme() === 'dark';


  if (__DEV__) {
    const errorHandler = (error, isFatal) => {
      console.log('Global Error Handler:', error, isFatal);
      // You can send this error to your analytics service
    };

    setJSExceptionHandler(errorHandler, true);

    // setNativeExceptionHandler((errorString) => {
    //   console.log('Native Error Handler:', errorString);
    //   // You can send this error to your analytics service
    // }, true);
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <SaralGeetaApp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
