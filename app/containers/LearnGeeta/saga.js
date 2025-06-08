import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { SAVE_RESULT, SHLOKS_DETAILS } from './constants';
import {
  getShloksDetailFail,
  getShloksDetailSuccess,
  saveResultFail,
  saveResultSuccess,
} from './actions';

function* getShloksDetailHandler({ payload }) {
  let url = Helpers.getUrl(APIS.SHLOKS);
  url = `${url}/${payload.shlok?.id}/media`;
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getShloksDetailSuccess(res.data));
  } catch (e) {
    yield put(getShloksDetailFail(e));
  }
}

function* saveUserResult({ payload }) {
  const url = Helpers.getUrl(APIS.SAVE_RESULT);
  const options = {
    method: 'POST',
    url,
    data: payload,
  };

  try {
    yield call(request, options);
    yield put(saveResultSuccess());
  } catch (e) {
    yield put(saveResultFail(e));
  }
}

export default function* learnGeetaSaga() {
  yield takeLatest(SHLOKS_DETAILS, getShloksDetailHandler);
  yield takeLatest(SAVE_RESULT, saveUserResult);
}
