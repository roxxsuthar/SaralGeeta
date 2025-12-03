/*
 *
 * App actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_ONBOARDING_VISITED,
  SET_LANGUAGE,
  LOGIN_ACTION,
  LOGIN_ACTION_SUCCESS,
  LOGIN_ACTION_FAIL,
  VERIFY_OTP,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAIL,
  UPDATE_USER_DETAILS,
  UPDATE_USER_DETAILS_SUCCESS,
  UPDATE_USER_DETAILS_FAIL,
  SELECT_IDEALS,
  INTRO_VIDEO_PLAY,
  INTRO_VIDEO_RESET,
  EDIT_PROFILE_ACTION,
  EDIT_PROFILE_ACTION_SUCCESS,
  EDIT_PROFILE_ACTION_FAIL,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  OAUTH_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function setLanguage(payload) {
  return {
    type: SET_LANGUAGE,
    payload,
  };
}

export function setOnboardingVisited() {
  return {
    type: SET_ONBOARDING_VISITED,
  };
}

export function sendOtpAction(payload, callback) {
  return {
    type: LOGIN_ACTION,
    payload,
    callback,
  };
}

export function sendOtpSuccessAction(payload) {
  return {
    type: LOGIN_ACTION_SUCCESS,
    payload,
  };
}

export function sendOtpFailAction() {
  return {
    type: LOGIN_ACTION_FAIL,
  };
}

export function verifyOtpAction(payload, callback) {
  return {
    type: VERIFY_OTP,
    payload,
    callback,
  };
}

export function verifyOtpSuccessAction(payload) {
  return {
    type: VERIFY_OTP_SUCCESS,
    payload,
  };
}

export function verifyOtpFailAction() {
  return {
    type: VERIFY_OTP_FAIL,
  };
}

export function updateUserDetails(payload) {
  return {
    type: UPDATE_USER_DETAILS,
    payload,
  };
}

export function updateUserDetailsSuccess(payload) {
  return {
    type: UPDATE_USER_DETAILS_SUCCESS,
    payload,
  };
}

export function updateUserDetailsFail() {
  return {
    type: UPDATE_USER_DETAILS_FAIL,
  };
}

export function selectIdeal(payload) {
  return {
    type: SELECT_IDEALS,
    payload,
  };
}

export function introVideoWatched() {
  return {
    type: INTRO_VIDEO_PLAY,
  };
}

export function resetIntroVideo() {
  return {
    type: INTRO_VIDEO_RESET,
  };
}

export function editProfile(payload, navigation) {
  return {
    type: EDIT_PROFILE_ACTION,
    payload,
    navigation,
  };
}

export function editProfileSuccess(payload) {
  return {
    type: EDIT_PROFILE_ACTION_SUCCESS,
    payload,
  };
}

export function editProfileFail() {
  return {
    type: EDIT_PROFILE_ACTION_FAIL,
  };
}

export function logOutUser(payload) {
  return {
    type: LOGOUT_USER,
    payload,
  };
}

export function logOutUserSuccess() {
  return {
    type: LOGOUT_USER_SUCCESS,
  };
}

export function logOutUserFail() {
  return {
    type: LOGOUT_USER_FAIL,
  };
}

export function oAuthAction(payload, callback) {
  return {
    type: OAUTH_ACTION,
    payload,
    callback,
  };
}
