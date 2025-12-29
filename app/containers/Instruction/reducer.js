/*
 *
 * Instruction reducer
 *
 */
import { produce } from 'immer';
import {
  DEFAULT_ACTION,
  GET_INSTRUCTION,
  GET_INSTRUCTION_SUCCESS,
  GET_INSTRUCTION_FAIL,
} from './constants';

export const initialState = {
  loading: false,
  data: null,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line default-param-last
const instructionReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case GET_INSTRUCTION:
        draft.loading = true;
        draft.error = false;
        break;
      case GET_INSTRUCTION_SUCCESS:
        draft.loading = false;
        draft.data = action.payload;
        draft.error = false;
        break;
      case GET_INSTRUCTION_FAIL:
        draft.loading = false;
        draft.error = true;
        break;
    }
  });

export default instructionReducer;
