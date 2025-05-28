/*
 *
 * Profile actions
 *
 */

import { DEFAULT_ACTION } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getProfile() {
  return {
    type: 'GET_PROFILE',
  };
}
export function getProfileSuccess(payload) {
  return {
    type: 'GET_PROFILE_SUCCESS',
    payload,
  };
}
export function getProfileFail(error) {
  return {
    type: 'GET_PROFILE_Fail',
    error,
  };
}