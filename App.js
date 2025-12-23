/* eslint-disable no-undef */
import React from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { enableScreens } from 'react-native-screens';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Load Reactotron BEFORE configuring store
if (__DEV__) {
  require('./ReactotronConfig');
}

import SaralGeetaApp from './app/containers/App';

import configureStore from './configureStore';

enableScreens(true);

const { store, persistor } = configureStore();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SaralGeetaApp />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
