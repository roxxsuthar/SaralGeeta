import {combineReducers} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

import appReducer from './app/containers/App/reducer';

const appPersistConfig = {
  key: 'app',
  storage: AsyncStorage,
};

const combinedReducers = combineReducers({
  app: persistReducer(appPersistConfig, appReducer),
});

// Root Reducer
export default (state, action) => {
  // if (action?.type === LOG_OUT) {
  //   const {app} = state;
  //   const newState = {app};
  //   return combinedReducers(newState, action);
  // }
  return combinedReducers(state, action);
};
