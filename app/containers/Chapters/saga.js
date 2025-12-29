import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { getRecentWatchedFail, getRecentWatchedSuccess } from './actions';
import { GET_RECENT } from './constants';
function* getRecentWatched() {
  const url = Helpers.getUrl(APIS.RECENT_WATCHED);
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getRecentWatchedSuccess(res?.data));
  } catch (e) {
    yield put(getRecentWatchedFail(e));
  }
}

export default function* chaptersSaga() {
  yield takeLatest(GET_RECENT, getRecentWatched);
}
