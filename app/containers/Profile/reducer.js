/*
 *
 * Profile reducer
 *
 */
import { produce } from 'immer';
import { DEFAULT_ACTION,GET_PROFILE,GET_PROFILE_SUCCESS,GET_PROFILE_FAIL } from './constants';

export const initialState = {
  data: null,
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line default-param-last
const profileReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case GET_PROFILE:
        draft.loading = true;
        break;
      case GET_PROFILE_SUCCESS:
        draft.data = action.profile;
        draft.loading = false;
        break;
      case GET_PROFILE_FAIL:
        draft.loading = false;
        break;
     
    }
  });

export default profileReducer;
