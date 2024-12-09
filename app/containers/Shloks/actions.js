/*
 *
 * Shloks actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_SHLOKS,
  GET_SHLOKS_FAIL,
  GET_SHLOKS_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getShloks(payload) {
  return {
    type: GET_SHLOKS,
    payload,
  };
}

export function getShloksSuccess(payload) {
  return {
    type: GET_SHLOKS_SUCCESS,
    payload,
  };
}

export function getShloksFail() {
  return {
    type: GET_SHLOKS_FAIL,
  };
}
