import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import {
  sendOtpSuccessAction,
  sendOtpFailAction,
  verifyOtpSuccessAction,
  verifyOtpFailAction,
} from '../App/actions';
import { LOGIN_ACTION, OAUTH_ACTION } from '../App/constants';
import { Navigation } from '../../constants/constants';

function* sendOtpApiHandler({ payload, callback }) {
  const url = Helpers.getUrl(APIS.LOGIN);
  const options = {
    method: 'POST',
    url,
    data: payload,
  };

  try {
    const res = yield call(request, options);
    yield put(sendOtpSuccessAction(res.data));
    callback?.navigate(Navigation.OtpScreen);
  } catch (e) {
    yield put(sendOtpFailAction(e));
  }
}

function* oAuthHAndler({ payload, callback }) {
  const url = Helpers.getUrl(APIS.OAUTH);
  const options = {
    method: 'POST',
    url,
    data: payload,
  };

  try {
    const res = yield call(request, options);
    yield put(verifyOtpSuccessAction(res.data));
    callback?.();
  } catch (e) {
    yield put(verifyOtpFailAction(e));
  }
}

export default function* loginSaga() {
  yield takeLatest(LOGIN_ACTION, sendOtpApiHandler);
  yield takeLatest(OAUTH_ACTION, oAuthHAndler);
}
