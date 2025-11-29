/*
 *
 * TermsOfUse actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_TERMS,
  GET_TERMS_SUCCESS,
  GET_TERMS_FAIL,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getTerms(policyType) {
  return {
    type: GET_TERMS,
    policyType,
  };
}

export function getTermsSuccess(payload) {
  return {
    type: GET_TERMS_SUCCESS,
    payload,
  };
}

export function getTermsFail() {
  return {
    type: GET_TERMS_FAIL,
  };
}
