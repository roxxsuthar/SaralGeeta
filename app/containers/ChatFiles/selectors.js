import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the chatFiles state domain
 */

const selectChatFilesDomain = (state) => state.chatFiles || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ChatFiles
 */

const makeSelectChatFiles = () =>
  createSelector(selectChatFilesDomain, (substate) => substate);

export default makeSelectChatFiles;
export { selectChatFilesDomain };
