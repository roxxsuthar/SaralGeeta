import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { GET_GITA_RULES, SUBMIT_GITA_RULES, GET_RULES_STATS } from './constants';
import {
  getGitaRulesSuccess,
  getGitaRulesFail,
  submitGitaRulesSuccess,
  submitGitaRulesFail,
  getRulesStatsSuccess,
  getRulesStatsFail,
} from './actions';
import { makeSelectAppLanguage } from '../App/selectors';

function* getGitaRulesSaga({ language }) {
  const url = Helpers.getUrl(APIS.RULES);
  try {
    const options = {
      method: 'GET',
      url,
      headers: {
        'Accept-Language': language === 'hi' ? 'hi' : 'en',
      },
    };
    const response = yield call(request, options);
    yield put(getGitaRulesSuccess(response.data));
  } catch (error) {
    yield put(getGitaRulesFail(error));
  }
}

function* submitGitaRulesSaga({ payload, navigation }) {
  const url = Helpers.getUrl(APIS.SUBMIT_RULES);
  const languageState = yield select(makeSelectAppLanguage());
  const currentLanguage = languageState?.currentLanguage || 'hi';

  try {
    const transformedPayload = (payload.rule || []).map((id) => ({
      rule: id,
      user_input: 'Yes',
    }));
    const options = {
      method: 'POST',
      url,
      data: transformedPayload,
      headers: {
        'Accept-Language': currentLanguage,
      },
    };

    const response = yield call(request, options);

    if (response && response.success) {
      yield put(submitGitaRulesSuccess(response.data || []));
    } else {
      yield put(submitGitaRulesFail(response));
    }
  } catch (error) {
    yield put(submitGitaRulesFail(error));
  }
}

function* getRulesStatsSaga() {
  const url = Helpers.getUrl(APIS.RULES_STATS);
  const languageState = yield select(makeSelectAppLanguage());
  const currentLanguage = languageState?.currentLanguage || 'hi';

  try {
    const options = {
      method: 'GET',
      url,
      headers: {
        'Accept-Language': currentLanguage,
      },
    };
    const response = yield call(request, options);

    if (response && response.success) {
      yield put(getRulesStatsSuccess(response.data || []));
    } else {
      yield put(getRulesStatsFail(response));
    }
  } catch (error) {
    yield put(getRulesStatsFail(error));
  }
}

export default function* gitaRulesSaga() {
  yield takeLatest(GET_GITA_RULES, getGitaRulesSaga);
  yield takeLatest(SUBMIT_GITA_RULES, submitGitaRulesSaga);
  yield takeLatest(GET_RULES_STATS, getRulesStatsSaga);
}
