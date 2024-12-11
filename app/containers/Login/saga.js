import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { sendOtpSuccessAction, sendOtpFailAction } from '../App/actions';
import { LOGIN_ACTION } from '../App/constants';
import { Navigation } from '../../constants/constants';

function* sendOtpApiHandler({ payload, callback }) {
  const url = Helpers.getUrl(APIS.REGISTRATION);
  const options = {
    method: 'POST',
    url,
    data: payload,
  };

  try {
    const res = yield call(request, options);
    console.log('res', res);
    yield put(sendOtpSuccessAction(res.results));
    callback?.navigate(Navigation.OtpScreen);
  } catch (e) {
    yield put(sendOtpFailAction(e));
  }
}

export default function* loginSaga() {
  yield takeLatest(LOGIN_ACTION, sendOtpApiHandler);
}
