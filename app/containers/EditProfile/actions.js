import logger from '../../utils/logger';
/*
 *
 * EditProfile actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_LANGUAGES,
  GET_LANGUAGES_SUCCESS,
  GET_LANGUAGES_FAIL,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getLanguage() {
  logger.log('---------FIRED------');
  return {
    type: GET_LANGUAGES,
  };
}
export function getLanguageSuccess(payload) {
  return {
    type: GET_LANGUAGES_SUCCESS,
    payload,
  };
}
export function getLanguageFail() {
  return {
    type: GET_LANGUAGES_FAIL,
  };
}
