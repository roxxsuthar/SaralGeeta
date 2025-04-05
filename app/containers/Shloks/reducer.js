/*
 *
 * Shloks reducer
 *
 */
import { produce } from 'immer';
import {
  DEFAULT_ACTION,
  GET_SHLOKS,
  GET_SHLOKS_FAIL,
  GET_SHLOKS_SUCCESS,
} from './constants';

export const initialState = {
  data: null,
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line default-param-last
const shloksReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case GET_SHLOKS:
        draft.loading = true;
        break;
      case GET_SHLOKS_SUCCESS:
        draft.data = action.payload;
        draft.loading = false;
        break;
      case GET_SHLOKS_FAIL:
        draft.loading = false;
        break;
    }
  });

export default shloksReducer;
