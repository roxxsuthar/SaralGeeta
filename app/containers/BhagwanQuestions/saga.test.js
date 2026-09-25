import { call, put } from 'redux-saga/effects';

jest.mock('../../utils/request', () => jest.fn());
jest.mock('../../utils/helpers', () => ({
  getUrl: jest.fn(() => 'https://example.test/api/questions/next'),
}));

import request from '../../utils/request';
import Helpers from '../../utils/helpers';
import { getQuestionsSuccess } from './actions';
import { getQuestionsHandler } from './saga';

describe('getQuestionsHandler', () => {
  it('requests questions for the selected project', () => {
    const generator = getQuestionsHandler({
      accessToken: 'token',
      chapter_serial: 7,
    });
    const url = Helpers.getUrl('/questions/next');
    const response = { data: { question: 'Question', answer: 'Answer' } };

    expect(generator.next().value).toEqual(
      call(request, {
        method: 'GET',
        url,
        params: { chapter_serial: 7 },
        headers: { Authorization: 'Bearer token' },
      }),
    );
    expect(generator.next(response).value).toEqual(
      put(getQuestionsSuccess(response)),
    );
  });

  it('marks the project complete when no questions remain', () => {
    const generator = getQuestionsHandler({ chapter_serial: 7 });
    const requestEffect = generator.next().value;
    const error = { response: { status: 404 } };

    expect(requestEffect).toEqual(
      call(request, {
        method: 'GET',
        url: Helpers.getUrl('/questions/next'),
        params: { chapter_serial: 7 },
        headers: undefined,
      }),
    );
    expect(generator.throw(error).value).toEqual(put(getQuestionsSuccess(null)));
    expect(generator.next().done).toBe(true);
  });
});
