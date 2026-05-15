/*
 *
 * GitaRules reducer
 *
 */

import { produce } from 'immer';
import {
  GET_GITA_RULES,
  GET_GITA_RULES_SUCCESS,
  GET_GITA_RULES_FAIL,
  SUBMIT_GITA_RULES,
  SUBMIT_GITA_RULES_SUCCESS,
  SUBMIT_GITA_RULES_FAIL,
  GET_RULES_STATS,
  GET_RULES_STATS_SUCCESS,
  GET_RULES_STATS_FAIL,
  CLEAN_UP,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  rules: [],
  selectedToday: null,
  submitLoading: false,
  submitSuccess: false,
  submitError: null,
  stats: [],
  statsLoading: false,
  statsSuccess: false,
  statsError: null,
};

/* eslint-disable default-case, no-param-reassign */
const gitaRulesReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_GITA_RULES:
        draft.loading = true;
        draft.error = null;
        break;
      case GET_GITA_RULES_SUCCESS:
        draft.loading = false;
        draft.rules = action.data.rules || action.data;
        draft.selectedToday = action.data.selected_rule || null;
        break;
      case GET_GITA_RULES_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;
      case SUBMIT_GITA_RULES:
        draft.submitLoading = true;
        draft.submitSuccess = false;
        draft.submitError = null;
        break;
      case SUBMIT_GITA_RULES_SUCCESS:
        draft.submitLoading = false;
        draft.submitSuccess = true;
        if (Array.isArray(action.response?.data || action.response)) {
          draft.rules = action.response?.data || action.response;
        } else {
          draft.selectedToday = action.response?.data || action.response;
        }
        break;
      case SUBMIT_GITA_RULES_FAIL:
        draft.submitLoading = false;
        draft.submitError = action.error;
        break;
      case GET_RULES_STATS:
        draft.statsLoading = true;
        draft.statsSuccess = false;
        draft.statsError = null;
        break;
      case GET_RULES_STATS_SUCCESS:
        draft.statsLoading = false;
        draft.statsSuccess = true;
        draft.stats = action.data || [];
        break;
      case GET_RULES_STATS_FAIL:
        draft.statsLoading = false;
        draft.statsSuccess = false;
        draft.statsError = action.error;
        break;
      case CLEAN_UP:
        return initialState;
    }
  });

export default gitaRulesReducer;

