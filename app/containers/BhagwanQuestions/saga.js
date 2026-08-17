import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { Platform } from 'react-native';

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { GET_QUESTIONS, SUBMIT_ANSWERS } from './constants';
import {
  getQuestionsSuccess,
  submitAnswersSuccess,
  submitAnswersFail,
} from './actions';

export function* getQuestionsHandler() {
  const url = Helpers.getUrl('/questions');

  try {
    // Use raw axios (no interceptors) so a 403 from the Admin-only endpoint
    // does NOT trigger the global Snackbar/handleError popup.
    const res = yield call(() => axios({ method: 'GET', url }));
    yield put(getQuestionsSuccess(res?.data || []));
  } catch (e) {
    // Silently fall back to localized mock questions
    console.log('BhagwanQuestions: GET /questions silently failed:', e?.response?.status);
    const dummyQuestions = [
      { id: 'mock-1', question: '' },
      { id: 'mock-2', question: '' },
      { id: 'mock-3', question: '' },
    ];
    yield put(getQuestionsSuccess(dummyQuestions));
  }
}

export function* submitAnswersHandler({ payload }) {
  // payload: [{ questionId, answer }]
  try {
    for (const item of payload) {
      if (!item.answer) continue;

      const url = Helpers.getUrl('/questions');
      const formData = new FormData();
      
      const fileUri = Platform.OS === 'android' ? `file://${item.answer}` : item.answer;
      const mimeType = Platform.OS === 'android' ? 'audio/mp4' : 'audio/x-m4a';
      const fileName = item.answer.split('/').pop();

      formData.append('question', {
        uri: fileUri,
        type: mimeType,
        name: fileName,
      });

      formData.append('audio', {
        uri: fileUri,
        type: mimeType,
        name: fileName,
      });

      const options = {
        method: 'POST',
        url,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      };
      yield call(request, options);
    }
    yield put(submitAnswersSuccess());
  } catch (e) {
    console.log('================ API CALL ERROR ================');
    console.log('Error Message:', e.message);
    console.log('Error Response Data:', e.response?.data);
    console.log('Error Response Status:', e.response?.status);
    console.log('Error Request Config (URL):', e.config?.url);
    console.log('Error Request Config (Headers):', e.config?.headers);
    if (e.config?.data && e.config.data._parts) {
      console.log('FormData payload parts:', e.config.data._parts);
    }
    console.log('Full Error Object:', e);
    console.log('================================================');
    yield put(submitAnswersFail(e));
  }
}

export default function* bhagwanQuestionsSaga() {
  yield takeLatest(GET_QUESTIONS, getQuestionsHandler);
  yield takeLatest(SUBMIT_ANSWERS, submitAnswersHandler);
}
