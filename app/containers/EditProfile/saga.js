import { call, put, takeLatest } from 'redux-saga/effects';
import { useNavigation } from 'react-native';
import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { APIS } from '../../constants';
import { EDIT_PROFILE_ACTION } from '../App/constants';
import { editProfileFail, editProfileSuccess } from '../App/actions';
import { GET_LANGUAGES } from './constants';
import { getLanguageFail, getLanguageSuccess } from './actions';

function* getLanguage() {
  const url = Helpers.getUrl(APIS.LANGUAGES);
  const options = {
    method: 'GET',
    url,
  };

  try {
    const res = yield call(request, options);
    yield put(getLanguageSuccess(res.data));
  } catch (e) {
    yield put(getLanguageFail(e));
  }
}

function* editProfile({ payload, navigation }) {
  // const navigation = useNavigation();
  const url = Helpers.getUrl(APIS.UPDATE_USER);
  const options = {
    method: 'PATCH',
    url,
    data: payload,
  };

  try {
    const res = yield call(request, options);
    yield put(editProfileSuccess(res.data));
    navigation.goBack(null);
  } catch (e) {
    yield put(editProfileFail(e));
  }
}

export default function* editProfileSaga() {
  yield takeLatest(GET_LANGUAGES, getLanguage);
  yield takeLatest(EDIT_PROFILE_ACTION, editProfile);
}
