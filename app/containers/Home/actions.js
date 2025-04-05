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
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getChapters() {
  return {
    type: GET_CHAPTERS,
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
