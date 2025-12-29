import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the otpScreen state domain
 */

const selectOtpScreenDomain = (state) => state.otpScreen || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OtpScreen
 */

const makeSelectOtpScreen = () =>
  createSelector(selectOtpScreenDomain, (substate) => substate);

export default makeSelectOtpScreen;
export { selectOtpScreenDomain };
