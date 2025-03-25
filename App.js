import React from 'react';
import { Provider } from 'react-redux';
import { enableScreens } from 'react-native-screens';
import { PersistGate } from 'redux-persist/integration/react';

import SaralGeetaApp from './app/containers/App';

import configureStore from './configureStore';

enableScreens(true);

const { store, persistor } = configureStore();

if (__DEV__) {
  require('./ReactotronConfig');
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SaralGeetaApp />
      </PersistGate>
    </Provider>
  );
}

export default App;
