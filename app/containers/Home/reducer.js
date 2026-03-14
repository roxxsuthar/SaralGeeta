/*
 *
 * Home reducer
 *
 */
import { produce } from 'immer';
import {
  DEFAULT_ACTION,
  GET_CHAPTERS,
  GET_CHAPTERS_FAIL,
  GET_CHAPTERS_SUCCESS,
  GET_RECENT,
  GET_RECENT_FAIL,
  GET_RECENT_SUCCESS,
} from './constants';

export const initialState = {
  data: null,
  loading: false,
  recent: null,
};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line default-param-last
const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action?.type) {
      case DEFAULT_ACTION:
        break;
      case GET_CHAPTERS:
        draft.loading = true;
        draft.data = null;
        break;
      case GET_CHAPTERS_SUCCESS:
        draft.data = action.payload;
        draft.loading = false;
        break;
      case GET_CHAPTERS_FAIL:
        draft.loading = false;
        break;
      case GET_RECENT:
        draft.loading = true;
        break;
      case GET_RECENT_SUCCESS:
        draft.recent = action.payload;
        draft.loading = false;
        break;
      case GET_RECENT_FAIL:
        draft.loading = false;
        break;
    }
  });

export default homeReducer;
