import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { CONTACT_US_ACTION } from './constants';
import { addContactUsFails, addContactUsSuccess } from './actions';
function* addContact({ payload, navigation }) {
  const url = Helpers.getUrl(APIS.CONTACT_US);
  const options = {
    method: 'POST',
    url,
    data: payload,
  };

  try {
    yield call(request, options);
    yield put(addContactUsSuccess());
    navigation.goBack(null);
  } catch (e) {
    yield put(addContactUsFails(e));
  }
}

export default function* contactUsSaga() {
  yield takeLatest(CONTACT_US_ACTION, addContact);
}
