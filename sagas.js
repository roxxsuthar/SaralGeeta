import { all } from 'redux-saga/effects';
import appSaga from './app/containers/App/saga';
import OurIdealsSaga from './app/containers/OurIdeals/saga';
import HomeSaga from './app/containers/Home/saga';
import ShloksSaga from './app/containers/Shloks/saga';
import LearnGeetaSaga from './app/containers/LearnGeeta/saga';
import chaptersSaga from './app/containers/Chapters/saga';
import contactUs from './app/containers/ContactUs/saga';
import privacyPolicySaga from './app/containers/PrivacyPolicy/saga';
import termsOfUseSaga from './app/containers/TermsOfUse/saga';
import instructionSaga from './app/containers/Instruction/saga';
import languageSaga from './app/containers/Language/saga';
import studentGiftSaga from './app/containers/StudentGift/saga';
import teacherGiftSaga from './app/containers/TeachGeeta/saga';

export default function* rootContainerSaga() {
  yield all([
    appSaga(),
    OurIdealsSaga(),
    HomeSaga(),
    ShloksSaga(),
    LearnGeetaSaga(),
    chaptersSaga(),
    contactUs(),
    privacyPolicySaga(),
    termsOfUseSaga(),
    instructionSaga(),
    languageSaga(),
    studentGiftSaga(),
    teacherGiftSaga(),
  ]);
}
