/*
 *
 * EditProfile reducer
 *
 */
import { produce } from 'immer';
import {
  DEFAULT_ACTION,
  GET_LANGUAGES,
  GET_LANGUAGES_FAIL,
  GET_LANGUAGES_SUCCESS,
} from './constants';

export const initialState = {
  language: [],
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line default-param-last
const editProfileReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case GET_LANGUAGES:
        draft.loading = true;
        break;
      case GET_LANGUAGES_SUCCESS:
        draft.language = action.payload;
        draft.loading = false;
        break;
      case GET_LANGUAGES_FAIL:
        draft.loading = false;
        break;
    }
  });

export default editProfileReducer;
