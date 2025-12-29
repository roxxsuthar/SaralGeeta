/*
 *
 * PrivacyPolicy reducer
 *
 */
import { produce } from 'immer';
import {
  DEFAULT_ACTION,
  GET_POLICY,
  GET_POLICY_SUCCESS,
  GET_POLICY_FAIL,
} from './constants';

export const initialState = {
  loading: false,
  data: null,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line default-param-last
const privacyPolicyReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case GET_POLICY:
        draft.loading = true;
        draft.error = false;
        break;
      case GET_POLICY_SUCCESS:
        draft.loading = false;
        draft.data = action.payload;
        draft.error = false;
        break;
      case GET_POLICY_FAIL:
        draft.loading = false;
        draft.error = true;
        break;
    }
  });

export default privacyPolicyReducer;
