import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { getTermsSuccess, getTermsFail } from './actions';
import { GET_TERMS } from './constants';

function* fetchTerms({ policyType }) {
  const url = Helpers.getUrl(`${APIS.POLICY}/${policyType}`);
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getTermsSuccess(res?.data));
  } catch {
    yield put(getTermsFail());
  }
}

export default function* termsOfUseSaga() {
  yield takeLatest(GET_TERMS, fetchTerms);
}
