import { produce } from 'immer';
import {
  GET_FULL_GEETA,
  GET_FULL_GEETA_SUCCESS,
  GET_FULL_GEETA_ERROR,
  CLEAN_UP,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  data: [],
};

/* eslint-disable default-case, no-param-reassign */
const fullChapterLearnReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_FULL_GEETA:
        draft.loading = true;
        draft.error = null;
        break;
      case GET_FULL_GEETA_SUCCESS:
        draft.loading = false;
        draft.data = action.data;
        break;
      case GET_FULL_GEETA_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
      case CLEAN_UP:
        return initialState;
    }
  });

export default fullChapterLearnReducer;
