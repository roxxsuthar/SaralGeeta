import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { getInstructionSuccess, getInstructionFail } from './actions';
import { GET_INSTRUCTION } from './constants';

function* fetchInstruction({ policyType }) {
  const url = Helpers.getUrl(`${APIS.POLICY}/${policyType}`);
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getInstructionSuccess(res?.data));
  } catch {
    yield put(getInstructionFail());
  }
}

export default function* instructionSaga() {
  yield takeLatest(GET_INSTRUCTION, fetchInstruction);
}
