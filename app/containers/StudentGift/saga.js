import { takeLatest, call, put, select } from 'redux-saga/effects';
import { SUBMIT_STUDENT_GIFT } from './constants';
import { submitStudentGiftSuccess, submitStudentGiftFail } from './actions';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { makeSelectAppLanguage } from '../App/selectors';

function* submitStudentGiftSaga({ payload }) {
    let url = Helpers.getUrl(APIS.JOIN_SARAL_GITA);
    url = url + '/student';
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
        yield put(submitStudentGiftSuccess(response.data));
    } catch (error) {
        yield put(submitStudentGiftFail(error));
    }
}

export default function* studentGiftSaga() {
    yield takeLatest(SUBMIT_STUDENT_GIFT, submitStudentGiftSaga);
}
