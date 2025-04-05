import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the shloks state domain
 */

const selectShloksDomain = (state) => state.shloks || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Shloks
 */

const makeSelectShloks = () =>
  createSelector(selectShloksDomain, (substate) => substate);

export default makeSelectShloks;
export { selectShloksDomain };
