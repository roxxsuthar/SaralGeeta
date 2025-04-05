import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the onboardingOne state domain
 */

const selectOnboardingOneDomain = (state) =>
  state.onboardingOne || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OnboardingOne
 */

const makeSelectOnboardingOne = () =>
  createSelector(selectOnboardingOneDomain, (substate) => substate);

export default makeSelectOnboardingOne;
export { selectOnboardingOneDomain };
