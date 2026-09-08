import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { LOGOUT_USER, DEVICE_AUTH } from './constants';
import {
  logOutUserFail,
  logOutUserSuccess,
  deviceAuthSuccessAction,
  deviceAuthFailAction,
} from './actions';

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


function* deviceAuth({ payload, callback }) {
  const url = Helpers.getUrl(APIS.DEVICE_AUTH);
  const options = {
    method: 'POST',
    url,
    data: payload,
  };

  try {
    const response = yield call(request, options);
    const authData = response?.data || response;
    yield put(deviceAuthSuccessAction(authData));
    callback?.();
  } catch (e) {
    yield put(deviceAuthFailAction(e));
  }
}

export default function* appSaga() {
  yield takeLatest(LOGOUT_USER, logOutUser);
  yield takeLatest(DEVICE_AUTH, deviceAuth);
}
