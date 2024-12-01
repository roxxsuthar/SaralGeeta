import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the eBooks state domain
 */

const selectEBooksDomain = (state) => state.eBooks || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by EBooks
 */

const makeSelectEBooks = () =>
  createSelector(selectEBooksDomain, (substate) => substate);

export default makeSelectEBooks;
export { selectEBooksDomain };
