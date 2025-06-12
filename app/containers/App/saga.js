import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { LOGOUT_USER } from './constants';
import { logOutUserFail, logOutUserSuccess } from './actions';
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

export default function* appSaga() {
  yield takeLatest(LOGOUT_USER, logOutUser);
}
