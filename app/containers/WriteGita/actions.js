/*
 *
 * WriteGita actions
 *
 */

import {
  GET_RULES,
  GET_RULES_SUCCESS,
  GET_RULES_FAIL,
  SUBMIT_WRITE_GITA,
  SUBMIT_WRITE_GITA_SUCCESS,
  SUBMIT_WRITE_GITA_FAIL,
  CLEAN_UP,
} from './constants';

export function getRules(language) {
  return {
    type: GET_RULES,
    language,
  };
}

export function getRulesSuccess(payload) {
  return {
    type: GET_RULES_SUCCESS,
    payload,
  };
}

export function getRulesFail(error) {
  return {
    type: GET_RULES_FAIL,
    error,
  };
}

export function submitWriteGita(payload, navigation, action) {
  return {
    type: SUBMIT_WRITE_GITA,
    payload,
    navigation,
    action,
  };
}

export function submitWriteGitaSuccess(payload) {
  return {
    type: SUBMIT_WRITE_GITA_SUCCESS,
    payload,
  };
}

export function submitWriteGitaFail(error) {
  return {
    type: SUBMIT_WRITE_GITA_FAIL,
    error,
  };
}

export function cleanUp() {
  return {
    type: CLEAN_UP,
  };
}
