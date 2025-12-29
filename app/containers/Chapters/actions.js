/*
 *
 * Chapters actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_RECENT,
  GET_RECENT_FAIL,
  GET_RECENT_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getRecentWatched() {
  return {
    type: GET_RECENT,
  };
}

export function getRecentWatchedSuccess(payload) {
  return {
    type: GET_RECENT_SUCCESS,
    payload,
  };
}

export function getRecentWatchedFail() {
  return {
    type: GET_RECENT_FAIL,
  };
}
