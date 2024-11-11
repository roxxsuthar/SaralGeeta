import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the language state domain
 */

const selectLanguageDomain = (state) => state.language || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Language
 */

const makeSelectLanguage = () =>
  createSelector(selectLanguageDomain, (substate) => substate);

export default makeSelectLanguage;
export { selectLanguageDomain };
