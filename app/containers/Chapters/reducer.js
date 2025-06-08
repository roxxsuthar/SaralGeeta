/*
 *
 * Chapters reducer
 *
 */
import { produce } from 'immer';
import {
  DEFAULT_ACTION,
  GET_RECENT,
  GET_RECENT_FAIL,
  GET_RECENT_SUCCESS,
} from './constants';

export const initialState = {
  data: [],
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line default-param-last
const chaptersReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;

      case GET_RECENT:
        draft.loading = true;
        break;
      case GET_RECENT_SUCCESS:
        draft.data = action.payload;
        draft.loading = false;
        break;
      case GET_RECENT_FAIL:
        draft.loading = false;
        break;
    }
  });

export default chaptersReducer;
