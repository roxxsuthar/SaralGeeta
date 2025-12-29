import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { GET_PROFILE } from './constants';
import { getProfileFail, getProfileSuccess } from './actions';

function* fetchProfile() {
  let url = Helpers.getUrl(APIS.PROFILE);
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getProfileSuccess(res));
  } catch (e) {
    yield put(getProfileFail(e));
  }
}

// watcher saga
export function* profileSaga() {
  yield takeLatest(GET_PROFILE, fetchProfile);
}
