/*
 *
 * OurIdeals reducer
 *
 */
import { produce } from 'immer';
import {
  DEFAULT_ACTION,
  GET_OUR_IDEALS,
  GET_OUR_IDEALS_FAIL,
  GET_OUR_IDEALS_SUCCESS,
} from './constants';

export const initialState = {
  loading: false,
  data: null,
};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line default-param-last
const ourIdealsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action?.type) {
      case DEFAULT_ACTION:
        break;
      case GET_OUR_IDEALS:
        draft.loading = true;
        break;
      case GET_OUR_IDEALS_SUCCESS:
        draft.data = action.payload;
        draft.loading = false;
        break;
      case GET_OUR_IDEALS_FAIL:
        draft.loading = false;
        break;
    }
  });

export default ourIdealsReducer;
