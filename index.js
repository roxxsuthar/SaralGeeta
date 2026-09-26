/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { startNetworkLogging } from 'react-native-network-logger';
import App from './App';
import { name as appName } from './app.json';

if (__DEV__) {
  startNetworkLogging({ maxRequests: 500 });
}

AppRegistry.registerComponent(appName, () => App);
