import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { GET_GITA_RULES, SUBMIT_GITA_RULES } from './constants';
import {
  getGitaRulesSuccess,
  getGitaRulesFail,
  submitGitaRulesSuccess,
  submitGitaRulesFail,
} from './actions';

function* getGitaRulesSaga({ language }) {
  const url = Helpers.getUrl(APIS.RULES);
  try {
    const options = {
      method: 'GET',
      url,
      headers: {
        'Accept-Language': language === 'hi' ? 'hi' : 'en',
      },
    };
    const response = yield call(request, options);
    yield put(getGitaRulesSuccess(response.data));
  } catch (error) {
    yield put(getGitaRulesFail(error));
  }
}

function* submitGitaRulesSaga({ payload, navigation }) {
  const url = Helpers.getUrl(APIS.SUBMIT_RULES);
  try {
    const options = {
      method: 'POST',
      url,
      data: payload,
    };
    const response = yield call(request, options);
    yield put(submitGitaRulesSuccess(response));
  } catch (error) {
    yield put(submitGitaRulesFail(error));
  }
}

export default function* gitaRulesSaga() {
  yield takeLatest(GET_GITA_RULES, getGitaRulesSaga);
  yield takeLatest(SUBMIT_GITA_RULES, submitGitaRulesSaga);
}
