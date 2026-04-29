import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the writeGita state domain
 */

const selectWriteGitaDomain = (state) => state.writeGita || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used in WriteGita
 */

const makeSelectWriteGita = () =>
  createSelector(selectWriteGitaDomain, (substate) => substate);

export default makeSelectWriteGita;
export { selectWriteGitaDomain };
