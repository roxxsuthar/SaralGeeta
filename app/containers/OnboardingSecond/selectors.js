import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the onboardingSecond state domain
 */

const selectOnboardingSecondDomain = (state) =>
  state.onboardingSecond || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OnboardingSecond
 */

const makeSelectOnboardingSecond = () =>
  createSelector(selectOnboardingSecondDomain, (substate) => substate);

export default makeSelectOnboardingSecond;
export { selectOnboardingSecondDomain };
