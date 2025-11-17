import React from 'react';
import { Provider } from 'react-redux';
import { enableScreens } from 'react-native-screens';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SaralGeetaApp from './app/containers/App';

import configureStore from './configureStore';

enableScreens(true);

const { store, persistor } = configureStore();

if (__DEV__) {
  require('./ReactotronConfig');
}

function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SaralGeetaApp />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
