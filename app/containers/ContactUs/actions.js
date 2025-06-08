/*
 *
 * ContactUs actions
 *
 */

import {
  CONTACT_US_ACTION,
  CONTACT_US_ACTION_FAIL,
  CONTACT_US_ACTION_SUCCESS,
  DEFAULT_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function addContactUs(payload, navigation) {
  return {
    type: CONTACT_US_ACTION,
    payload,
    navigation,
  };
}
export function addContactUsSuccess() {
  return {
    type: CONTACT_US_ACTION_SUCCESS,
  };
}
export function addContactUsFails() {
  return {
    type: CONTACT_US_ACTION_FAIL,
  };
}
