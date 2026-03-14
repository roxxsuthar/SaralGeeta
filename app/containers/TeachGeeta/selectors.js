import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the teacherGift state domain
 */

const selectTeacherGiftDomain = (state) => state.teacherGift || initialState;

/**
 * Default selector used in TeacherGift
 */

const makeSelectTeacherGift = () =>
    createSelector(selectTeacherGiftDomain, (substate) => substate);

export default makeSelectTeacherGift;
export { selectTeacherGiftDomain };
