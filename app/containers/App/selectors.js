import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the app state domain
 */

const selectAppDomain = (state) => state.app || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by App
 */

const makeSelectApp = () =>
  createSelector(selectAppDomain, (substate) => substate);

const makeSelectAppLanguage = () =>
  createSelector(selectAppDomain, (substate) => substate.language);

const makeSelectOnboardingVisited = () =>
  createSelector(selectAppDomain, (substate) => substate.onboarding);

export default makeSelectApp;
export { selectAppDomain, makeSelectAppLanguage, makeSelectOnboardingVisited };
