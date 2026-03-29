import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { GET_LANGUAGE } from './constants';
import {
  getLanguageSuccess,
  getLanguageFail,
} from './actions';

function* getLanguage() {
  const url = Helpers.getUrl(APIS.LANGUAGES);
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getLanguageSuccess(res.data));

  } catch (e) {
    yield put(getLanguageFail(e));
  }
}

export default function* languageSaga() {
  yield takeLatest(GET_LANGUAGE, getLanguage);
}
