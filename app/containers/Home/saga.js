import { call, put, takeLatest } from 'redux-saga/effects';
import isEmpty from 'lodash/isEmpty'
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { GET_CHAPTERS, GET_RECENT } from './constants';
import {
  getChaptersFail,
  getChaptersSuccess,
  getRecentWatchedFail,
  getRecentWatchedSuccess,
} from './actions';

function* getChaptersHandler({ language }) {
  const url = Helpers.getUrl(APIS.CHAPTERS);
  const options = {
    method: 'GET',
    url,
    headers: {
      'Accept-Language': language === 'hi' ? 'hi' : 'en',
    },
  };

  try {
    const res = yield call(request, options);
    yield put(getChaptersSuccess(res.data));
  } catch (e) {
    yield put(getChaptersFail(e));
  }
}

function* getRecentWatched() {
  const url = Helpers.getUrl(APIS.RECENT_WATCHED);
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getRecentWatchedSuccess(isEmpty(res?.data)?null:res?.data));
  } catch (e) {
    yield put(getRecentWatchedFail(e));
  }
}

export default function* homeSaga() {
  yield takeLatest(GET_CHAPTERS, getChaptersHandler);
  yield takeLatest(GET_RECENT, getRecentWatched);
}
