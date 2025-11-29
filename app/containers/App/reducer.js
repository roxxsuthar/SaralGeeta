/*
 *
 * App reducer
 *
 */
import { produce } from 'immer';
import {
  DEFAULT_ACTION,
  EDIT_PROFILE_ACTION,
  EDIT_PROFILE_ACTION_FAIL,
  EDIT_PROFILE_ACTION_SUCCESS,
  GET_PROFILE,
  GET_PROFILE_FAIL,
  GET_PROFILE_SUCCESS,
  INTRO_VIDEO_PLAY,
  LOGIN_ACTION,
  LOGIN_ACTION_FAIL,
  LOGIN_ACTION_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_FAIL,
  LOGOUT_USER_SUCCESS,
  SELECT_IDEALS,
  SET_LANGUAGE,
  SET_ONBOARDING_VISITED,
  UPDATE_USER_DETAILS,
  UPDATE_USER_DETAILS_FAIL,
  UPDATE_USER_DETAILS_SUCCESS,
  VERIFY_OTP,
  VERIFY_OTP_FAIL,
  VERIFY_OTP_SUCCESS,
  OAUTH_ACTION,
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
  refreshToken: null,
  user: null,
  sentOtpDetail: null,
  selectedIdeal: null,
  introVideo: false,
  introVideoDate: null, // Track when intro video was last played
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
      case OAUTH_ACTION:
        draft.loading = true;
        break;
      case VERIFY_OTP:
        draft.loading = true;
        break;
      case VERIFY_OTP_SUCCESS:
        draft.user = action.payload.user;
        draft.accessToken = action.payload.access_token;
        draft.refreshToken = action.payload.refresh_token;
        draft.loading = false;
        break;
      case VERIFY_OTP_FAIL:
        draft.loading = false;
        break;
      case UPDATE_USER_DETAILS:
        draft.loading = true;
        break;
      case UPDATE_USER_DETAILS_SUCCESS:
        draft.user = action.payload;
        draft.loading = false;
        break;
      case UPDATE_USER_DETAILS_FAIL:
        draft.loading = false;
        break;
      case SELECT_IDEALS:
        draft.selectedIdeal = action.payload;
        break;
      case INTRO_VIDEO_PLAY:
        draft.introVideo = true;
        draft.introVideoDate = new Date().toDateString(); // Store current date
        break;

      case GET_PROFILE:
        draft.loading = true;
        break;
      case GET_PROFILE_SUCCESS:
        draft.user = action.payload;
        draft.loading = false;
        break;
      case GET_PROFILE_FAIL:
        draft.loading = false;
        break;
      case EDIT_PROFILE_ACTION:
        draft.loading = true;
        break;
      case EDIT_PROFILE_ACTION_SUCCESS:
        draft.user = action.payload;
        draft.loading = false;
        break;
      case EDIT_PROFILE_ACTION_FAIL:
        draft.loading = false;
        break;
      case LOGOUT_USER:
        draft.accessToken = null;
        draft.user = null;
        // draft.loading = true;
        break;
      case LOGOUT_USER_SUCCESS:
        draft.accessToken = null;
        draft.user = null;
        // draft.loading = false;
        break;
      case LOGOUT_USER_FAIL:
        // draft.loading = false;
        break;
    }
  });

export default appReducer;
