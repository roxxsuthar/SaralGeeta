/*
 *
 * Language reducer
 *
 */
import { produce } from 'immer';
import { DEFAULT_ACTION, GET_LANGUAGE_SUCCESS, GET_LANGUAGE_FAIL, GET_LANGUAGE } from './constants';

export const initialState = {
  languages: [],
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line default-param-last
const languageReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case GET_LANGUAGE:
        draft.loading = true;
        break;
      case GET_LANGUAGE_SUCCESS:
        draft.languages = action.payload;
        draft.loading = false;
        break;
      case GET_LANGUAGE_FAIL:
        draft.languages = [];
        draft.loading = false;
        break;
    }
  });

export default languageReducer;
