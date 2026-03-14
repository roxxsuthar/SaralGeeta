import { takeLatest, call, put } from 'redux-saga/effects';
import { SUBMIT_TEACHER_GIFT } from './constants';
import { submitTeacherGiftSuccess, submitTeacherGiftFail } from './actions';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';

function* submitTeacherGiftSaga({ payload }) {
    let url = Helpers.getUrl(APIS.JOIN_SARAL_GITA);
    url = url + '/teacher';
    try {
        const options = {
            method: 'POST',
            url,
            data: payload,
        };
        const response = yield call(request, options);
        yield put(submitTeacherGiftSuccess(response.data));
    } catch (error) {
        yield put(submitTeacherGiftFail(error));
    }
}

export default function* teacherGiftSaga() {
    yield takeLatest(SUBMIT_TEACHER_GIFT, submitTeacherGiftSaga);
}
