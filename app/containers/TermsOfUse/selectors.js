import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the termsOfUse state domain
 */

const selectTermsOfUseDomain = (state) => state.termsOfUse || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by TermsOfUse
 */

const makeSelectTermsOfUse = () =>
  createSelector(selectTermsOfUseDomain, (substate) => substate);

export default makeSelectTermsOfUse;
export { selectTermsOfUseDomain };
