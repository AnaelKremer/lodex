import { call, put, select, race, take } from 'redux-saga/effects';

import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromUser } from '../../sharedSelectors';
import { handlePublishRequest } from './sagas';
import { FINISH_PROGRESS, ERROR_PROGRESS } from '../progress/reducer';

import {
    publishError,
    publishSuccess,
} from './';

describe('publication saga', () => {
    describe('handlePublishRequest', () => {
        const saga = handlePublishRequest();

        it('should select getPublishRequest', () => {
            expect(saga.next().value).toEqual(
                select(fromUser.getPublishRequest),
            );
        });

        it('should call fetchSaga with the request', () => {
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should race ERROR_PROGRESS and FINISH_PROGRESS', () => {
            expect(saga.next({}).value).toEqual(
                race({
                    progressFinish: take(FINISH_PROGRESS),
                    progressError: take(ERROR_PROGRESS),
                }),
            );
        });

        it('should put publishSuccess action', () => {
            expect(saga.next({ progressFinish: true }).value).toEqual(
                put(publishSuccess()),
            );
        });

        it('should put publishError action with error from request if any', () => {
            const failedSaga = handlePublishRequest();
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value).toEqual(
                put(publishError('foo')),
            );
        });

        it('should put publishError action with error from progress if any', () => {
            const failedSaga = handlePublishRequest();
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({}).value).toEqual(
                race({
                    progressFinish: take(FINISH_PROGRESS),
                    progressError: take(ERROR_PROGRESS),
                }),
            );
            expect(
                failedSaga.next({
                    progressError: { payload: { error: 'error' } },
                }).value,
            ).toEqual(put(publishError('error')));
        });
    });
});
