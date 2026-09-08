import {
  GET_QUESTIONS,
  GET_QUESTIONS_SUCCESS,
  GET_QUESTIONS_FAIL,
  SUBMIT_ANSWERS,
  SUBMIT_ANSWERS_SUCCESS,
  SUBMIT_ANSWERS_FAIL,
  RESET_SUBMIT,
} from './constants';

export function getQuestions(accessToken) {
  return {
    type: GET_QUESTIONS,
    accessToken,
  };
}

export function getQuestionsSuccess(data) {
  return {
    type: GET_QUESTIONS_SUCCESS,
    data,
  };
}

export function getQuestionsFail(error) {
  return {
    type: GET_QUESTIONS_FAIL,
    error,
  };
}

export function submitAnswers(payload, accessToken) {
  return {
    type: SUBMIT_ANSWERS,
    payload,
    accessToken,
  };
}

export function submitAnswersSuccess() {
  return {
    type: SUBMIT_ANSWERS_SUCCESS,
  };
}

export function submitAnswersFail(error) {
  return {
    type: SUBMIT_ANSWERS_FAIL,
    error,
  };
}

export function resetSubmit() {
  return {
    type: RESET_SUBMIT,
  };
}
