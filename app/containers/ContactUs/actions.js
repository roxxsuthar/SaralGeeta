/*
 *
 * ContactUs actions
 *
 */

import {
  CONTACT_US_ACTION,
  CONTACT_US_ACTION_FAIL,
  CONTACT_US_ACTION_SUCCESS,
  CLEAN_UP,
  DEFAULT_ACTION,
} from './constants';

export function cleanUp() {
  return {
    type: CLEAN_UP,
  };
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function addContactUs(payload, navigation, action) {
  return {
    type: CONTACT_US_ACTION,
    payload,
    navigation,
    action,
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
