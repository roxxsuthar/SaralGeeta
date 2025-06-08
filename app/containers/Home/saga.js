import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { GET_CHAPTERS } from './constants';
import { getChaptersFail, getChaptersSuccess } from './actions';

function* getChaptersHandler() {
  const url = Helpers.getUrl(APIS.CHAPTERS);
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getChaptersSuccess(res.data));
  } catch (e) {
    yield put(getChaptersFail(e));
  }
}

export default function* homeSaga() {
  yield takeLatest(GET_CHAPTERS, getChaptersHandler);
}
