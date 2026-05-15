import { takeLatest, call, put, select } from 'redux-saga/effects';
import request from '../../utils/request';
import { GET_FULL_GEETA } from './constants';
import { getFullGeetaSuccess, getFullGeetaError } from './actions';
import { makeSelectAppLanguage } from '../App/selectors';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';

export function* fetchFullGeeta(action) {
  const { payload } = action;
  const languageState = yield select(makeSelectAppLanguage());
  const currentLanguage = languageState?.currentLanguage || 'hi';
  const chapterId = payload?.chapter_id || '';
  const idealId = payload?.ideal_id || '';
  const requestURL = `${Helpers.getUrl(APIS.FULL_GEETA)}?chapter_id=${chapterId}&ideal_id=${idealId}`;

  try {
    const options = {
      method: 'GET',
      url: requestURL,
      headers: {
        'Accept-Language': currentLanguage,
      },
    };

    console.log("options----------", options);
    const response = yield call(request, options);

    if (response.success) {
      yield put(getFullGeetaSuccess(response.data));
    } else {
      yield put(getFullGeetaError(response.message || 'Failed to fetch data'));
    }
  } catch (err) {
    yield put(getFullGeetaError(err.message || 'An error occurred'));
  }
}

export default function* FullChapterLearnSaga() {
  yield takeLatest(GET_FULL_GEETA, fetchFullGeeta);
}
