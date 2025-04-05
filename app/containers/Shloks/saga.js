import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { GET_SHLOKS } from './constants';
import { getShloksFail, getShloksSuccess } from './actions';

function* getShloksHandler({ payload }) {
  let url = Helpers.getUrl(APIS.SHLOKS);
  url = `${url}?limit=all&chapter_id=${payload?.chapterId}`;
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getShloksSuccess(res.results));
  } catch (e) {
    yield put(getShloksFail(e));
  }
}

export default function* shloksSaga() {
  yield takeLatest(GET_SHLOKS, getShloksHandler);
}
