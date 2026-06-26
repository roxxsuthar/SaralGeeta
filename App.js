/* eslint-disable no-undef */
import 'react-native-gesture-handler'; // FIRST
import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, TextInput, Platform, Alert, Linking } from 'react-native';
import SpInAppUpdates, {
  IAUUpdateKind,
} from 'sp-react-native-in-app-updates';

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
  useEffect(() => {
    const inAppUpdates = new SpInAppUpdates(
      false // isDebug
    );

    inAppUpdates.checkNeedsUpdate().then((result) => {
      if (result.shouldUpdate) {
        if (Platform.OS === 'android') {
          inAppUpdates.startUpdate({
            updateType: IAUUpdateKind.FLEXIBLE,
          });
        } else if (Platform.OS === 'ios') {
          Alert.alert(
            'Update Available',
            'There is a new version of the app available on the App Store. Please update to the latest version.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Upgrade',
                onPress: () => {
                  // Attempt to open the store URL if provided by the check
                  if (result.storeUrl) {
                    Linking.openURL(result.storeUrl).catch((err) => {
                    });
                  } else {
                    // Fallback to a generic App Store search or specific app ID if known
                    // Since we may not know the exact App ID if it's not live, we try the bundle ID
                    // or you can replace 'idYOUR_APP_ID' with your actual Apple ID.
                    console.log('No store URL returned, app might not be live yet');
                  }
                },
              },
            ]
          );
        }
      }
    }).catch(err => {
      console.log('Error checking for app updates', err);
    });
  }, []);

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
