/*
 *
 * Home actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_CHAPTERS,
  GET_CHAPTERS_FAIL,
  GET_CHAPTERS_SUCCESS,
  GET_RECENT,
  GET_RECENT_FAIL,
  GET_RECENT_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getChapters(language) {
  return {
    type: GET_CHAPTERS,
    language,
  };
}
export function getChaptersSuccess(payload) {
  return {
    type: GET_CHAPTERS_SUCCESS,
    payload,
  };
}
export function getChaptersFail() {
  return {
    type: GET_CHAPTERS_FAIL,
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
