/*
 *
 * LearnGeeta actions
 *
 */

import {
  DEFAULT_ACTION,
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
