import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { GET_PROFILE, LOGOUT_USER } from './constants';
import { logOutUserFail, logOutUserSuccess } from './actions';
import { getProfileFail, getProfileSuccess } from '../Profile/actions';

function* logOutUser({ payload }) {
  const url = Helpers.getUrl(APIS.LOG_OUT);
  const options = {
    method: 'POST',
    url,
    data: payload,
  };

  try {
    yield call(request, options);
    yield put(logOutUserSuccess());
  } catch (e) {
    yield put(logOutUserFail(e));
  }
}

function* fetchProfile() {
  let url = Helpers.getUrl(APIS.PROFILE);

  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getProfileSuccess(res?.data));
  } catch (e) {
    yield put(getProfileFail(e));
  }
}

export default function* appSaga() {
  yield takeLatest(LOGOUT_USER, logOutUser);
  yield takeLatest(GET_PROFILE, fetchProfile);
}
