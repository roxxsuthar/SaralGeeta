/*
 *
 * App reducer
 *
 */
import { produce } from 'immer';
import {
  DEFAULT_ACTION,
  SET_LANGUAGE,
  SET_ONBOARDING_VISITED,
} from './constants';

export const initialState = {
  language: {
    currentLanguage: 'en',
    isLanguageSelected: false,
  },
  onboarding: {
    isOnboardingVisited: false,
  },
};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line default-param-last
const appReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_LANGUAGE:
        draft.language.currentLanguage = action.payload;
        draft.language.isLanguageSelected = true;
        break;
      case SET_ONBOARDING_VISITED:
        draft.onboarding.isOnboardingVisited = true;
        break;
    }
  });

export default appReducer;
