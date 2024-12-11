import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { SHLOKS_DETAILS } from './constants';
import { getShloksDetailFail, getShloksDetailSuccess } from './actions';

function* getShloksDetailHandler({ payload }) {
  let url = Helpers.getUrl(APIS.SHLOKS);
  url = `${url}/${payload.shlok_id}`;
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getShloksDetailSuccess(res.results));
  } catch (e) {
    yield put(getShloksDetailFail(e));
  }
}

export default function* learnGeetaSaga() {
  yield takeLatest(SHLOKS_DETAILS, getShloksDetailHandler);
}
