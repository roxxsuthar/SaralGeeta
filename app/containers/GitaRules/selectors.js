import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the gitaRules state domain
 */

const selectGitaRulesDomain = (state) => state.gitaRules || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used in GitaRules
 */

const makeSelectGitaRules = () =>
  createSelector(selectGitaRulesDomain, (substate) => substate);

export default makeSelectGitaRules;
export { selectGitaRulesDomain };
