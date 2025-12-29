import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the contactUs state domain
 */

const selectContactUsDomain = (state) => state.contactUs || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ContactUs
 */

const makeSelectContactUs = () =>
  createSelector(selectContactUsDomain, (substate) => substate);

export default makeSelectContactUs;
export { selectContactUsDomain };
