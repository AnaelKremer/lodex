import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const LOAD_PUBLICATION = 'LOAD_PUBLICATION';
export const LOAD_PUBLICATION_SUCCESS = 'LOAD_PUBLICATION_SUCCESS';
export const LOAD_PUBLICATION_ERROR = 'LOAD_PUBLICATION_ERROR';

export const loadPublication = createAction(LOAD_PUBLICATION);
export const loadPublicationSuccess = createAction(LOAD_PUBLICATION_SUCCESS);
export const loadPublicationError = createAction(LOAD_PUBLICATION_ERROR);

export const defaultState = {
    loading: false,
    fields: null,
    characteristics: [],
    published: null,
};

export default handleActions({
    LOAD_PUBLICATION: state => ({
        ...state,
        error: null,
        loading: true,
    }),
    LOAD_PUBLICATION_SUCCESS: (state, { payload: { characteristics, fields, published } }) => ({
        ...state,
        characteristics,
        error: null,
        loading: false,
        fields,
        published,
    }),
    LOAD_PUBLICATION_ERROR: (state, { payload: error }) => ({
        ...state,
        error: error.message,
        loading: false,
    }),
}, defaultState);

export const hasPublishedDataset = ({ publication: { published } }) => published;

export const getFields = ({ publication: { fields } }) => fields || [];

// @TODO use template option to find which characteristic is the title
export const getTitle = ({ publication: { characteristics } }) => {
    const titleCharacteristic = characteristics.find(({ name }) => name === 'dataset_title');
    return titleCharacteristic ? titleCharacteristic.value : null;
};

export const getCollectionFields = createSelector(
    getFields,
    fields => fields.filter(f => f.cover === 'collection'),
);

const getPublication = ({ publication }) => publication;

export const getPublishData = createSelector(
    getPublication,
    ({ error, published, editedFieldIndex, loading }) => ({
        published,
        editedFieldIndex,
        loading,
        error: error && (error.message || error),
    }),
);

export const getLoadPublicationRequest = state => ({
    url: '/api/publication',
    credentials: 'include',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.user.token}`,
        'Content-Type': 'application/json',
    },
});
