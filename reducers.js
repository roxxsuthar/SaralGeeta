import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';

import appReducer from './app/containers/App/reducer';
import ourIdealsReducer from './app/containers/OurIdeals/reducer';
import homeReducer from './app/containers/Home/reducer';
import shloksReducer from './app/containers/Shloks/reducer';
import learnGeetaReducer from './app/containers/LearnGeeta/reducer';
import chaptersReducer from './app/containers/Chapters/reducer';
import contactUsReducer from './app/containers/ContactUs/reducer';
import privacyPolicyReducer from './app/containers/PrivacyPolicy/reducer';
import termsOfUseReducer from './app/containers/TermsOfUse/reducer';
import instructionReducer from './app/containers/Instruction/reducer';

const appPersistConfig = {
  key: 'app',
  storage: AsyncStorage,
  whitelist: [
    'language',
    'onboarding',
    'accessToken',
    'refreshToken',
    'user',
    'selectedIdeal',
    'introVideo',
    'introVideoDate',
  ],
};

const ourIdealsPersistConfig = {
  key: 'ourIdeals',
  storage: AsyncStorage,
};

const combinedReducers = combineReducers({
  app: persistReducer(appPersistConfig, appReducer),
  ourIdeals: persistReducer(ourIdealsPersistConfig, ourIdealsReducer),
  home: homeReducer,
  shloks: shloksReducer,
  learnGeeta: learnGeetaReducer,
  chapters: chaptersReducer,
  contactUs: contactUsReducer,
  privacyPolicy: privacyPolicyReducer,
  termsOfUse: termsOfUseReducer,
  instruction: instructionReducer,
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
