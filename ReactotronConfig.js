import Reactotron from 'reactotron-react-native';
import { NativeModules } from 'react-native';

// Get the local IP for connecting to Reactotron
let scriptHostname;
if (__DEV__) {
  const scriptURL = NativeModules.SourceCode.scriptURL;
  scriptHostname = scriptURL.split('://')[1].split(':')[0];
}

const reactotron = Reactotron.configure({
  name: 'SaralGeeta',
  host: scriptHostname, // Use the device's IP automatically
})
  .useReactNative({
    asyncStorage: false, // Set to true if you want to track AsyncStorage
    networking: {
      // Track network requests
      ignoreUrls: /symbolicate/,
    },
    editor: false,
    errors: { veto: () => false }, // Show all errors
    overlay: false,
  })
  .connect();

// Clear Reactotron on every app load during development
reactotron.clear();

console.tron = Reactotron;

export default reactotron;
