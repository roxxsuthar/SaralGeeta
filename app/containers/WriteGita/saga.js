import { takeLatest, call, put } from 'redux-saga/effects';
import { GET_RULES, SUBMIT_WRITE_GITA } from './constants';
import {
  getRulesSuccess,
  getRulesFail,
  submitWriteGitaSuccess,
  submitWriteGitaFail,
} from './actions';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';

function* getRulesSaga({ language }) {
  const url = Helpers.getUrl(APIS.GRANTH);
  try {
    const options = {
      method: 'GET',
      url,
      headers: {
        'Accept-Language': language === 'hi' ? 'hi' : 'en',
      },
    };
    const response = yield call(request, options);
    yield put(getRulesSuccess(response.data));
  } catch (error) {
    yield put(getRulesFail(error));
  }
}

function* submitWriteGitaSaga({ payload, navigation, action }) {
  const url = Helpers.getUrl(APIS.SUBMIT_GRANTH);

  try {
    const options = {
      method: 'POST',
      url,
      data: payload,
    };
    const response = yield call(request, options);
    yield put(submitWriteGitaSuccess(response.data));
  } catch (error) {
    console.log("------submit------", error)
    yield put(submitWriteGitaFail(error));
  }
}

export default function* writeGitaSaga() {
  yield takeLatest(GET_RULES, getRulesSaga);
  yield takeLatest(SUBMIT_WRITE_GITA, submitWriteGitaSaga);
}
