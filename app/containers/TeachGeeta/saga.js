import { takeLatest, call, put, select } from 'redux-saga/effects';
import { SUBMIT_TEACHER_GIFT } from './constants';
import { submitTeacherGiftSuccess, submitTeacherGiftFail } from './actions';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { makeSelectAppLanguage } from '../App/selectors';

function* submitTeacherGiftSaga({ payload }) {
    let url = Helpers.getUrl(APIS.JOIN_SARAL_GITA);
    url = url + '/teacher';
    const languageState = yield select(makeSelectAppLanguage());
    const currentLanguage = languageState?.currentLanguage || 'hi';
    try {
        const options = {
            method: 'POST',
            url,
            data: payload,
            headers: {
                'Accept-Language': currentLanguage,
            },
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
