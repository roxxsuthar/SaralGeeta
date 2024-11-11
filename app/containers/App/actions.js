/*
 *
 * App actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_ONBOARDING_VISITED,
  SET_LANGUAGE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function setLanguage(payload) {
  return {
    type: SET_LANGUAGE,
    payload,
  };
}

export function setOnboardingVisited() {
  return {
    type: SET_ONBOARDING_VISITED,
  };
}
