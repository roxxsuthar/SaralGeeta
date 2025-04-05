import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';

import appReducer from './app/containers/App/reducer';
import loginReducer from './app/containers/Login/reducer';
import ourIdealsReducer from './app/containers/OurIdeals/reducer';
import homeReducer from './app/containers/Home/reducer';
import shloksReducer from './app/containers/Shloks/reducer';
import learnGeetaReducer from './app/containers/LearnGeeta/reducer';

const appPersistConfig = {
  key: 'app',
  storage: AsyncStorage,
};

const combinedReducers = combineReducers({
  app: persistReducer(appPersistConfig, appReducer),
  login: loginReducer,
  ourIdeals: ourIdealsReducer,
  home: homeReducer,
  shloks: shloksReducer,
  learnGeeta: learnGeetaReducer,
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
