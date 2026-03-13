/*
 *
 * Language actions
 *
 */

import { DEFAULT_ACTION, GET_LANGUAGE, GET_LANGUAGE_FAIL, GET_LANGUAGE_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getLanguage() {
  console.log("-----")
  return {
    type: GET_LANGUAGE,
  };
}
export function getLanguageSuccess(payload) {
  return {
    type: GET_LANGUAGE_SUCCESS,
    payload: payload,
  };
}
export function getLanguageFail() {
  return {
    type: GET_LANGUAGE_FAIL,
  };
}