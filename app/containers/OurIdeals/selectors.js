import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ourIdeals state domain
 */

const selectOurIdealsDomain = (state) => state.ourIdeals || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OurIdeals
 */

const makeSelectOurIdeals = () =>
  createSelector(selectOurIdealsDomain, (substate) => substate);

export default makeSelectOurIdeals;
export { selectOurIdealsDomain };
