import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { EDIT_PROFILE_ACTION } from '../App/constants';
import { editProfileFail, editProfileSuccess } from '../App/actions';
import { GET_LANGUAGES } from './constants';
import { getLanguageFail, getLanguageSuccess } from './actions';
import handleError from '../../utils/handleError';

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

function* editProfile({ payload }) {
  const url = Helpers.getUrl(APIS.UPDATE_USER);
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    url,
    data: payload,
  };

  try {
    const res = yield call(request, options);
    yield put(editProfileSuccess(res.data));
    handleError({ message: 'Profile updated successfully.' });
  } catch (e) {
    yield put(editProfileFail(e));
  }
}

export default function* editProfileSaga() {
  yield takeLatest(GET_LANGUAGES, getLanguage);
  yield takeLatest(EDIT_PROFILE_ACTION, editProfile);
}
