import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { getPolicySuccess, getPolicyFail } from './actions';
import { GET_POLICY } from './constants';

function* fetchPolicy({ policyType }) {
  const url = Helpers.getUrl(`${APIS.POLICY}/${policyType}`);
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getPolicySuccess(res?.data));
  } catch {
    yield put(getPolicyFail());
  }
}

export default function* privacyPolicySaga() {
  yield takeLatest(GET_POLICY, fetchPolicy);
}
