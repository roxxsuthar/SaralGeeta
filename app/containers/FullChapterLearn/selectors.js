import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the fullChapterLearn state domain
 */

const selectFullChapterLearnDomain = (state) =>
  state.fullChapterLearn || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used in FullChapterLearn
 */

const makeSelectFullChapterLearn = () =>
  createSelector(selectFullChapterLearnDomain, (substate) => substate);

export default makeSelectFullChapterLearn;
export { selectFullChapterLearnDomain };
