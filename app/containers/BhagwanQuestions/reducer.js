import { produce } from 'immer';
import {
  GET_QUESTIONS,
  GET_QUESTIONS_SUCCESS,
  GET_QUESTIONS_FAIL,
  SUBMIT_ANSWERS,
  SUBMIT_ANSWERS_SUCCESS,
  SUBMIT_ANSWERS_FAIL,
} from './constants';

export const initialState = {
  loading: false,
  error: false,
  data: [],
  submitting: false,
  submitError: false,
  submitSuccess: false,
};

/* eslint-disable default-case, no-param-reassign */
const bhagwanQuestionsReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_QUESTIONS:
        draft.loading = true;
        draft.error = false;
        break;
      case GET_QUESTIONS_SUCCESS:
        draft.loading = false;
        draft.data = action.data;
        break;
      case GET_QUESTIONS_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;
      case SUBMIT_ANSWERS:
        draft.submitting = true;
        draft.submitError = false;
        draft.submitSuccess = false;
        break;
      case SUBMIT_ANSWERS_SUCCESS:
        draft.submitting = false;
        draft.submitSuccess = true;
        break;
      case SUBMIT_ANSWERS_FAIL:
        draft.submitting = false;
        draft.submitError = action.error;
        break;
    }
  });

export default bhagwanQuestionsReducer;
