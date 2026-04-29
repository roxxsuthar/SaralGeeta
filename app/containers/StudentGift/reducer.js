/*
 *
 * StudentGift reducer
 *
 */

import { produce } from 'immer';
import {
    SUBMIT_STUDENT_GIFT,
    SUBMIT_STUDENT_GIFT_SUCCESS,
    SUBMIT_STUDENT_GIFT_FAIL,
    CLEAN_UP,
} from './constants';

export const initialState = {
    loading: false,
    error: null,
    success: false,
};

/* eslint-disable default-case, no-param-reassign */
const studentGiftReducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case SUBMIT_STUDENT_GIFT:
                draft.loading = true;
                draft.error = null;
                draft.success = false;
                break;
            case SUBMIT_STUDENT_GIFT_SUCCESS:
                draft.loading = false;
                draft.success = true;
                break;
            case SUBMIT_STUDENT_GIFT_FAIL:
                draft.loading = false;
                draft.error = action.error;
                break;
            case CLEAN_UP:
                return initialState;
        }
    });

export default studentGiftReducer;
