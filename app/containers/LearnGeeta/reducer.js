/*
 *
 * LearnGeeta reducer
 *
 */
import { produce } from 'immer';
import {
  DEFAULT_ACTION,
  SHLOKS_DETAILS,
  SHLOKS_DETAILS_FAIL,
  SHLOKS_DETAILS_SUCCESS,
} from './constants';

export const initialState = {
  data: null,
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line default-param-last
const learnGeetaReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SHLOKS_DETAILS:
        draft.loading = true;
        break;
      case SHLOKS_DETAILS_SUCCESS:
        draft.data = action.payload;
        draft.loading = false;
        break;
      case SHLOKS_DETAILS_FAIL:
        draft.loading = false;
        break;
    }
  });

export default learnGeetaReducer;
