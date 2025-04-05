import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the learnGeeta state domain
 */

const selectLearnGeetaDomain = (state) => state.learnGeeta || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by LearnGeeta
 */

const makeSelectLearnGeeta = () =>
  createSelector(selectLearnGeetaDomain, (substate) => substate);

export default makeSelectLearnGeeta;
export { selectLearnGeetaDomain };
