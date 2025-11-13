import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';

import appReducer from './app/containers/App/reducer';
import loginReducer from './app/containers/Login/reducer';
import ourIdealsReducer from './app/containers/OurIdeals/reducer';
import homeReducer from './app/containers/Home/reducer';
import shloksReducer from './app/containers/Shloks/reducer';
import learnGeetaReducer from './app/containers/LearnGeeta/reducer';
import editProfileReducer from './app/containers/EditProfile/reducer';
import chaptersReducer from './app/containers/Chapters/reducer';
import contactUsReducer from './app/containers/ContactUs/reducer';

const appPersistConfig = {
  key: 'app',
  storage: AsyncStorage,
};

const ourIdealsPersistConfig = {
  key: 'ourIdeals',
  storage: AsyncStorage,
};

const combinedReducers = combineReducers({
  app: persistReducer(appPersistConfig, appReducer),
  login: loginReducer,
  ourIdeals: persistReducer(ourIdealsPersistConfig, ourIdealsReducer),
  home: homeReducer,
  shloks: shloksReducer,
  learnGeeta: learnGeetaReducer,
  editProfile: editProfileReducer,
  chapters: chaptersReducer,
  contactUs: contactUsReducer,
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
