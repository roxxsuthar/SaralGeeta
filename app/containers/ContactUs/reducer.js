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
} from './constants';

export const initialState = {
  loading: false,
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
        break;
      case CONTACT_US_ACTION_FAIL:
        draft.loading = false;
        break;
    }
  });

export default contactUsReducer;
