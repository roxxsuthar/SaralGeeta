/*
 *
 * OurIdeals actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_OUR_IDEALS,
  GET_OUR_IDEALS_FAIL,
  GET_OUR_IDEALS_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getIdealsData() {
  return {
    type: GET_OUR_IDEALS,
  };
}
export function getIdealsSuccess(payload) {
  return {
    type: GET_OUR_IDEALS_SUCCESS,
    payload,
  };
}
export function getIdealsFail() {
  return {
    type: GET_OUR_IDEALS_FAIL,
  };
}
