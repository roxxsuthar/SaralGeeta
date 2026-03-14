import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the studentGift state domain
 */

const selectStudentGiftDomain = (state) => state.studentGift || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used in StudentGift
 */

const makeSelectStudentGift = () =>
    createSelector(selectStudentGiftDomain, (substate) => substate);

export default makeSelectStudentGift;
export { selectStudentGiftDomain };
