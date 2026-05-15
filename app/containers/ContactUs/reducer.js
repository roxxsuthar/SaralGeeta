/*
 *
 * ContactUs reducer
 *
 */
import { produce } from 'immer';
import {
  CONTACT_US_ACTION,
  CONTACT_US_ACTION_FAIL,
  CONTACT_US_ACTION_SUCCESS,
  DEFAULT_ACTION,
  CLEAN_UP,
} from './constants';

export const initialState = {
  loading: false,
  success: false,
};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line default-param-last
const contactUsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case CONTACT_US_ACTION:
        draft.loading = true;
        break;
    case CONTACT_US_ACTION_SUCCESS:
        draft.loading = false;
        draft.success = true;
        break;
      case CONTACT_US_ACTION_FAIL:
        draft.loading = false;
        draft.success = false;
        break;
      case CLEAN_UP:
        draft.loading = false;
        draft.success = false;
        break;
    }
  });

export default contactUsReducer;
