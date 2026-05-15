import {
  GET_FULL_GEETA,
  GET_FULL_GEETA_SUCCESS,
  GET_FULL_GEETA_ERROR,
  CLEAN_UP,
} from './constants';

export function getFullGeeta(payload) {
  return {
    type: GET_FULL_GEETA,
    payload,
  };
}

export function getFullGeetaSuccess(data) {
  return {
    type: GET_FULL_GEETA_SUCCESS,
    data,
  };
}

export function getFullGeetaError(error) {
  return {
    type: GET_FULL_GEETA_ERROR,
    error,
  };
}

export function cleanUp() {
  return {
    type: CLEAN_UP,
  };
}
