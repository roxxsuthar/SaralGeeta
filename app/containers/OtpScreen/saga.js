import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { verifyOtpSuccessAction, verifyOtpFailAction } from '../App/actions';
import { VERIFY_OTP } from '../App/constants';

function* verifyOtpHandler({ payload, callback }) {
  const url = Helpers.getUrl(APIS.VERIFY_OTP);
  const options = {
    method: 'POST',
    url,
    data: payload,
  };

  try {
    const res = yield call(request, options);
    yield put(verifyOtpSuccessAction(res.results));
    callback?.();
  } catch (e) {
    yield put(verifyOtpFailAction(e));
  }
}

export default function* otpScreenSaga() {
  yield takeLatest(VERIFY_OTP, verifyOtpHandler);
}
