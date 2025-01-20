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

const makeSelectToken = () =>
  createSelector(selectAppDomain, (substate) => substate.accessToken);

const makeSelectUser = () =>
  createSelector(selectAppDomain, (substate) => substate.user);

const makeSelectOtpDetails = () =>
  createSelector(selectAppDomain, (substate) => substate.sentOtpDetail);
const makeSelectIdealDetails = () =>
  createSelector(selectAppDomain, (substate) => substate.selectedIdeal);
const makeSelectIntroVideo = () =>
  createSelector(selectAppDomain, (substate) => substate.introVideo);

const makeSelectAppLoading = () =>
  createSelector(selectAppDomain, (substate) => substate.loading);

export default makeSelectApp;
export {
  selectAppDomain,
  makeSelectAppLanguage,
  makeSelectOnboardingVisited,
  makeSelectToken,
  makeSelectUser,
  makeSelectOtpDetails,
  makeSelectIdealDetails,
  makeSelectIntroVideo,
  makeSelectAppLoading,
};
