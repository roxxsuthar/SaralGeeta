import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { GET_QUESTIONS } from './constants';
import {
  getQuestionsSuccess,
  getQuestionsFail,
} from './actions';

export function* getQuestionsHandler({ accessToken }) {
  const url = Helpers.getUrl('/questions/next');

  try {
    const response = yield call(request, {
      method: 'GET',
      url,
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    });
    const questionResponse = response?.data ? response : response?.data;
    yield put(getQuestionsSuccess(questionResponse || null));
  } catch (e) {
    if (e?.response?.status === 404) {
      yield put(getQuestionsSuccess(null));
      return;
    }
    console.warn('Questions API GET failed', {
      status: e?.response?.status,
      message: e?.response?.data?.message || e?.message,
      hasAccessToken: Boolean(accessToken),
      url,
    });
    yield put(getQuestionsFail(e));
  }
}

export default function* bhagwanQuestionsSaga() {
  yield takeLatest(GET_QUESTIONS, getQuestionsHandler);
}
