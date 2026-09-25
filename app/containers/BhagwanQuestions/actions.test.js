import { GET_QUESTIONS } from './constants';
import { getQuestions } from './actions';

describe('BhagwanQuestions actions', () => {
  it('includes the selected project id when fetching questions', () => {
    expect(getQuestions('token', 7)).toEqual({
      type: GET_QUESTIONS,
      accessToken: 'token',
      chapter_serial: 7,
    });
  });
});
