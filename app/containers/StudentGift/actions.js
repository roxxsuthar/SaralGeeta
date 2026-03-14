/*
 *
 * StudentGift actions
 *
 */

import {
    SUBMIT_STUDENT_GIFT,
    SUBMIT_STUDENT_GIFT_SUCCESS,
    SUBMIT_STUDENT_GIFT_FAIL,
} from './constants';

export function submitStudentGift(payload, navigation, action) {
    return {
        type: SUBMIT_STUDENT_GIFT,
        payload,
        navigation,
        action,
    };
}

export function submitStudentGiftSuccess(response) {
    return {
        type: SUBMIT_STUDENT_GIFT_SUCCESS,
        response,
    };
}

export function submitStudentGiftFail(error) {
    return {
        type: SUBMIT_STUDENT_GIFT_FAIL,
        error,
    };
}
