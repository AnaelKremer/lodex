import { call, put, race, select, take } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import fetch from '../fetch';
import { getCurrentLocation, logout } from '../../user';

export default function* fetchSaga(request, interruptingActions = [], mode = 'json') {
    const {
        fetchResult,
        cancel,
    } = yield race({
        fetchResult: call(fetch, request, mode),
        cancel: take([].concat(interruptingActions)),
    });

    if (cancel) {
        return { cancel };
    }

    if (fetchResult.error && fetchResult.error.code === 401) {
        const { locationBeforeTransitions } = yield select(getCurrentLocation);

        yield put(replace({
            pathname: '/login',
            state: { nextPathname: locationBeforeTransitions.pathname },
        }));

        yield put(logout());
    }

    return fetchResult;
}