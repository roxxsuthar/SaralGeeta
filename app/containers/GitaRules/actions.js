/*
 *
 * GitaRules actions
 *
 */

import {
  GET_GITA_RULES,
  GET_GITA_RULES_SUCCESS,
  GET_GITA_RULES_FAIL,
  SUBMIT_GITA_RULES,
  SUBMIT_GITA_RULES_SUCCESS,
  SUBMIT_GITA_RULES_FAIL,
  CLEAN_UP,
} from './constants';

export function getGitaRules(language) {
  return {
    type: GET_GITA_RULES,
    language,
  };
}

export function getGitaRulesSuccess(data) {
  return {
    type: GET_GITA_RULES_SUCCESS,
    data,
  };
}

export function getGitaRulesFail(error) {
  return {
    type: GET_GITA_RULES_FAIL,
    error,
  };
}

export function submitGitaRules(payload, navigation) {
  return {
    type: SUBMIT_GITA_RULES,
    payload,
    navigation,
  };
}

export function submitGitaRulesSuccess(response) {
  return {
    type: SUBMIT_GITA_RULES_SUCCESS,
    response,
  };
}

export function submitGitaRulesFail(error) {
  return {
    type: SUBMIT_GITA_RULES_FAIL,
    error,
  };
}

export function cleanUp() {
  return {
    type: CLEAN_UP,
  };
}
