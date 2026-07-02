import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectBhagwanQuestionsDomain = state => state.bhagwanQuestions || initialState;

const makeSelectBhagwanQuestions = () =>
  createSelector(
    selectBhagwanQuestionsDomain,
    substate => substate,
  );

export default makeSelectBhagwanQuestions;
export { selectBhagwanQuestionsDomain };
