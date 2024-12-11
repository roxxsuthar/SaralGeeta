import { all } from 'redux-saga/effects';
import appSaga from './app/containers/App/saga';
import loginSaga from './app/containers/Login/saga';
import otpScreenSaga from './app/containers/OtpScreen/saga';
import OurIdealsSaga from './app/containers/OurIdeals/saga';
import HomeSaga from './app/containers/Home/saga';
import ShloksSaga from './app/containers/Shloks/saga';
import LearnGeetaSaga from './app/containers/LearnGeeta/saga';

export default function* rootContainerSaga() {
  yield all([
    appSaga(),
    loginSaga(),
    otpScreenSaga(),
    OurIdealsSaga(),
    HomeSaga(),
    ShloksSaga(),
    LearnGeetaSaga(),
  ]);
}
