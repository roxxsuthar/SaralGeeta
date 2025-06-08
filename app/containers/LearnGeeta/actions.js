/*
 *
 * LearnGeeta actions
 *
 */

import {
  DEFAULT_ACTION,
  SAVE_RESULT,
  SAVE_RESULT_FAIL,
  SAVE_RESULT_SUCCESS,
  SHLOKS_DETAILS,
  SHLOKS_DETAILS_FAIL,
  SHLOKS_DETAILS_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getShloksDetail(payload) {
  return {
    type: SHLOKS_DETAILS,
    payload,
  };
}

export function getShloksDetailSuccess(payload) {
  return {
    type: SHLOKS_DETAILS_SUCCESS,
    payload,
  };
}

export function getShloksDetailFail() {
  return {
    type: SHLOKS_DETAILS_FAIL,
  };
}

export function saveResult(payload) {
  return {
    type: SAVE_RESULT,
    payload,
  };
}

export function saveResultSuccess() {
  return {
    type: SAVE_RESULT_SUCCESS,
  };
}

export function saveResultFail() {
  return {
    type: SAVE_RESULT_FAIL,
  };
}
