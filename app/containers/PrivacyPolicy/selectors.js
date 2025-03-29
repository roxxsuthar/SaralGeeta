import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the privacyPolicy state domain
 */

const selectPrivacyPolicyDomain = (state) =>
  state.privacyPolicy || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PrivacyPolicy
 */

const makeSelectPrivacyPolicy = () =>
  createSelector(selectPrivacyPolicyDomain, (substate) => substate);

export default makeSelectPrivacyPolicy;
export { selectPrivacyPolicyDomain };
