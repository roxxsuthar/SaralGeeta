import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the onboardingOne state domain
 */

const selectSplashDomain = (state) => state.splash || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Splash
 */

const makeSelectSplash = () =>
  createSelector(selectSplashDomain, (substate) => substate);

export default makeSelectSplash;
export { selectSplashDomain };
