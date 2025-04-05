import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { GET_CHAPTERS } from './constants';
import { getChaptersFail, getChaptersSuccess } from './actions';

function* getChaptersHandler() {
  let url = Helpers.getUrl(APIS.CHAPTERS);
  url = `${url}?limit=all`;
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getChaptersSuccess(res.results));
  } catch (e) {
    yield put(getChaptersFail(e));
  }
}

export default function* homeSaga() {
  yield takeLatest(GET_CHAPTERS, getChaptersHandler);
}
