import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { GET_OUR_IDEALS } from './constants';
import { getIdealsFail, getIdealsSuccess } from './actions';
import { UPDATE_USER_DETAILS } from '../App/constants';
import {
  updateUserDetailsFail,
  updateUserDetailsSuccess,
} from '../App/actions';

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

function* saveUserDetails({ payload }) {
  let url = Helpers.getUrl(APIS.UPDATE_USER);
  url = `${url}/${payload?.userId}`;
  const options = {
    method: 'PATCH',
    url,
    data: payload.data,
  };

  try {
    const res = yield call(request, options);
    yield put(updateUserDetailsSuccess(res?.results));
  } catch (e) {
    yield put(updateUserDetailsFail(e));
  }
}

export default function* ourIdealsSaga() {
  yield takeLatest(GET_OUR_IDEALS, getOurIdealsHandler);
  yield takeLatest(UPDATE_USER_DETAILS, saveUserDetails);
}
