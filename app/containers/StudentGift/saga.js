import { takeLatest, call, put } from 'redux-saga/effects';
import { SUBMIT_STUDENT_GIFT } from './constants';
import { submitStudentGiftSuccess, submitStudentGiftFail } from './actions';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';

function* submitStudentGiftSaga({ payload }) {
    // Note: API integration is pending.

    let url = Helpers.getUrl(APIS.JOIN_SARAL_GITA);
    url = url + '/student';
    try {
        const options = {
            method: 'POST',
            url,
            data: payload,
        };
        const response = yield call(request, options);
        yield put(submitStudentGiftSuccess(response.data));
    } catch (error) {
        yield put(submitStudentGiftFail(error));
    }
}

export default function* studentGiftSaga() {
    yield takeLatest(SUBMIT_STUDENT_GIFT, submitStudentGiftSaga);
}
