import {all} from 'redux-saga/effects';
import appSaga from './app/containers/App/saga';

export default function* rootContainerSaga() {
  yield all([appSaga()]);
}
