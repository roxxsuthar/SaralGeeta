/*
 *
 * App reducer
 *
 */
import { produce } from 'immer';
import {
  DEFAULT_ACTION,
  LOGIN_ACTION,
  LOGIN_ACTION_FAIL,
  LOGIN_ACTION_SUCCESS,
  SELECT_IDEALS,
  SET_LANGUAGE,
  SET_ONBOARDING_VISITED,
  VERIFY_OTP,
  VERIFY_OTP_FAIL,
  VERIFY_OTP_SUCCESS,
} from './constants';

export const initialState = {
  language: {
    currentLanguage: 'en',
    isLanguageSelected: false,
  },
  onboarding: {
    isOnboardingVisited: false,
  },
  loading: false,
  accessToken: null,
  user: null,
  sentOtpDetail: null,
  selectedIdeal: null,
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
      case LOGIN_ACTION:
        draft.loading = true;
        break;
      case LOGIN_ACTION_SUCCESS:
        draft.sentOtpDetail = action.payload;
        draft.loading = false;
        break;
      case LOGIN_ACTION_FAIL:
        draft.loading = false;
        break;
      case VERIFY_OTP:
        draft.loading = true;
        break;
      case VERIFY_OTP_SUCCESS:
        draft.user = action.payload;
        draft.accessToken = action.payload.access_token;
        draft.loading = false;
        break;
      case VERIFY_OTP_FAIL:
        draft.loading = false;
        break;

      case SELECT_IDEALS:
        draft.selectedIdeal = action.payload;
        break;
    }
  });

export default appReducer;
