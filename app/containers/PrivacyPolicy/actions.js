/*
 *
 * PrivacyPolicy actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_POLICY,
  GET_POLICY_SUCCESS,
  GET_POLICY_FAIL,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getPolicy(policyType) {
  return {
    type: GET_POLICY,
    policyType,
  };
}

export function getPolicySuccess(payload) {
  return {
    type: GET_POLICY_SUCCESS,
    payload,
  };
}

export function getPolicyFail() {
  return {
    type: GET_POLICY_FAIL,
  };
}
