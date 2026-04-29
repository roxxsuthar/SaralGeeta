/*
 *
 * TeacherGift reducer
 *
 */

import { produce } from 'immer';
import {
    SUBMIT_TEACHER_GIFT,
    SUBMIT_TEACHER_GIFT_SUCCESS,
    SUBMIT_TEACHER_GIFT_FAIL,
    CLEAN_UP,
} from './constants';

export const initialState = {
    loading: false,
    error: null,
    success: false,
};

/* eslint-disable default-case, no-param-reassign */
const teacherGiftReducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case SUBMIT_TEACHER_GIFT:
                draft.loading = true;
                draft.error = null;
                draft.success = false;
                break;
            case SUBMIT_TEACHER_GIFT_SUCCESS:
                draft.loading = false;
                draft.success = true;
                break;
            case SUBMIT_TEACHER_GIFT_FAIL:
                draft.loading = false;
                draft.error = action.error;
                break;
            case CLEAN_UP:
                return initialState;
        }
    });

export default teacherGiftReducer;
