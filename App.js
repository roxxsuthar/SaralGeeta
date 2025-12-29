/* eslint-disable no-undef */
import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { enableScreens } from 'react-native-screens';
import { NewAppScreen } from '@react-native/new-app-screen';

// Load Reactotron BEFORE configuring store
if (__DEV__) {
  require('./ReactotronConfig');
}

import SaralGeetaApp from './app/containers/App';
import configureStore from './configureStore';

enableScreens(true);

const { store, persistor } = configureStore();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

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
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Keep RN’s NewAppScreen for template preview, but render your app inside */}
      <NewAppScreen templateFileName="App.js" safeAreaInsets={safeAreaInsets} />
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
