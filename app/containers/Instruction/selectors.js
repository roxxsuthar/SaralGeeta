import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the Instruction state domain
 */

const selectInstructionDomain = (state) => state.instruction || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Instruction
 */

const makeSelectInstruction = () =>
  createSelector(selectInstructionDomain, (substate) => substate);

export default makeSelectInstruction;
export { selectInstructionDomain };
