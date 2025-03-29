/*
 *
 * TermsOfUse reducer
 *
 */
import { produce } from 'immer';
import { DEFAULT_ACTION } from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line default-param-last
const termsOfUseReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
    }
  });

export default termsOfUseReducer;
