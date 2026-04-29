/*
 *
 * TeacherGift actions
 *
 */

import {
    SUBMIT_TEACHER_GIFT,
    SUBMIT_TEACHER_GIFT_SUCCESS,
    SUBMIT_TEACHER_GIFT_FAIL,
    CLEAN_UP,
} from './constants';

export function submitTeacherGift(payload, navigation, action) {
    return {
        type: SUBMIT_TEACHER_GIFT,
        payload,
        navigation,
        action,
    };
}

export function submitTeacherGiftSuccess(response) {
    return {
        type: SUBMIT_TEACHER_GIFT_SUCCESS,
        response,
    };
}

export function submitTeacherGiftFail(error) {
    return {
        type: SUBMIT_TEACHER_GIFT_FAIL,
        error,
    };
}

export function cleanUp() {
    return {
        type: CLEAN_UP,
    };
}
