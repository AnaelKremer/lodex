import { select, takeEvery, call } from 'redux-saga/effects';

import { CHANGE_OPERATION } from '../';
import { fromFields } from '../../sharedSelectors';
import updateReduxFormArray from '../../lib/sagas/updateReduxFormArray';

export function* handleChangeOperation({ payload: { operation, fieldName } }) {
    let transformerArgs = [];
    if (operation) {
        transformerArgs = yield select(
            fromFields.getTransformerArgs,
            operation,
        );
    }

    yield call(
        updateReduxFormArray,
        'field',
        `${fieldName}.args`,
        transformerArgs,
    );
}

export default function* watchLoadField() {
    yield takeEvery([CHANGE_OPERATION], handleChangeOperation);
}
