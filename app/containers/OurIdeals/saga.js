import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { GET_OUR_IDEALS } from './constants';
import { getIdealsFail, getIdealsSuccess } from './actions';

function* getOurIdealsHandler() {
  let url = Helpers.getUrl(APIS.IDEALS);
  url = `${url}?limit=all`;
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getIdealsSuccess(res.results));
  } catch (e) {
    yield put(getIdealsFail(e));
  }
}

export default function* ourIdealsSaga() {
  yield takeLatest(GET_OUR_IDEALS, getOurIdealsHandler);
}
