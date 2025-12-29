import { call, put, takeLatest } from 'redux-saga/effects';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { CONTACT_US_ACTION } from './constants';
import { addContactUsFails, addContactUsSuccess } from './actions';
import handleError from '../../utils/handleError';
function* addContact({ payload, action }) {
  const url = Helpers.getUrl(APIS.CONTACT_US);
  const options = {
    method: 'POST',
    url,
    data: payload,
  };

  try {
    yield call(request, options);
    yield put(addContactUsSuccess());
    action?.resetForm();
    handleError({ message: "Message sent! We'll be in touch soon." });
  } catch (e) {
    yield put(addContactUsFails(e));
  }
}

export default function* contactUsSaga() {
  yield takeLatest(CONTACT_US_ACTION, addContact);
}
