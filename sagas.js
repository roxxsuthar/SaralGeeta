import { all } from 'redux-saga/effects';
import appSaga from './app/containers/App/saga';
import loginSaga from './app/containers/Login/saga';
import otpScreenSaga from './app/containers/OtpScreen/saga';
import OurIdealsSaga from './app/containers/OurIdeals/saga';
import HomeSaga from './app/containers/Home/saga';

export default function* rootContainerSaga() {
  yield all([
    appSaga(),
    loginSaga(),
    otpScreenSaga(),
    OurIdealsSaga(),
    HomeSaga(),
  ]);
}
