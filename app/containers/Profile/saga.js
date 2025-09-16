import logger from '../../utils/logger';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { GET_PROFILE } from './constants';
import { getProfileFail, getProfileSuccess } from './actions';

function* fetchProfile() {
  let url = Helpers.getUrl(APIS.PROFILE);
  url = `${url}/`;

  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    logger.log('Profile API response:', res);

    // Agar aapko sure nahi ki data kaha hai, to poora res bhejo reducer me
    yield put(getProfileSuccess(res)); // ya yield put(getProfileSuccess(res.results));
  } catch (e) {
    yield put(getProfileFail(e));
  }
}

// watcher saga
export function* profileSaga() {
  yield takeLatest(GET_PROFILE, fetchProfile);
}
