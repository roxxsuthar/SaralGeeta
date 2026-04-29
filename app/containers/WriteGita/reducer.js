/*
 *
 * WriteGita reducer
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

export const initialState = {
  loading: false,
  rules: [],
  success: false,
  error: null,
};

function writeGitaReducer(state = initialState, action) {
  switch (action.type) {
    case GET_RULES:
      return {
        ...state,
        loading: true,
      };
    case GET_RULES_SUCCESS:
      return {
        ...state,
        loading: false,
        rules: action.payload,
      };
    case GET_RULES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case SUBMIT_WRITE_GITA:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case SUBMIT_WRITE_GITA_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case SUBMIT_WRITE_GITA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case CLEAN_UP:
      return {
        ...initialState,
        rules: state.rules, // Keep rules if they were already fetched
      };
    default:
      return state;
  }
}

export default writeGitaReducer;
