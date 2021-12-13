import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import omit from 'lodash.omit';

import getQueryString from '../lib/getQueryString';

export const LOGIN_FORM_NAME = 'login';
export const TOGGLE_LOGIN = 'TOGGLE_LOGIN';
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const SIGNOUT = 'SIGNOUT';

export const defaultState = {
    showModal: false,
    token: null,
};

export default handleActions(
    {
        TOGGLE_LOGIN: state => ({
            ...state,
            showModal: !state.showModal,
        }),
        LOGIN_SUCCESS: (state, { payload: { token, role } }) => ({
            ...state,
            showModal: false,
            token: token,
            role,
        }),
        LOGOUT: state => ({
            ...state,
            showModal: true,
            token: null,
            role: null,
        }),
        SIGNOUT: state => ({
            ...state,
            showModal: false,
            token: null,
            role: null,
        }),
    },
    defaultState,
);

export const toggleLogin = createAction(TOGGLE_LOGIN);
export const login = createAction(LOGIN);
export const loginSuccess = createAction(LOGIN_SUCCESS);
export const logout = createAction(LOGOUT);
export const signOut = createAction(SIGNOUT);

export const isAdmin = state => state.role === 'admin';
export const getRole = state => state.role || 'not logged';
export const getToken = state => state.token;
export const getCookie = state => state.cookie;
export const isUserModalShown = state => state.showModal;

export const getRequest = createSelector(
    getToken,
    getCookie,
    (_, props) => props,
    (
        token,
        cookie,
        {
            body,
            method = 'GET',
            url,
            credentials = 'same-origin',
            cook = true,
            auth = true,
            head = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
    ) => {
        if (cook) {
            head['Cookie'] = cookie;
        }
        if (auth) {
            head['Authorization'] = `Bearer ${token}`;
        }
        if (typeof body == 'object') {
            body = JSON.stringify(body);
        }

        return {
            url,
            body,
            credentials,
            headers: head,
            method,
        };
    },
);

export const getLoginRequest = (state, credentials) =>
    getRequest(state, {
        url: '/api/login',
        body: credentials,
        method: 'POST',
    });

export const getLoadSubresourcesRequest = state =>
    getRequest(state, {
        url: '/api/subresource',
    });

export const getLoadEnrichmentsRequest = state =>
    getRequest(state, {
        url: '/api/enrichment',
    });

export const getScheduleDatasetEnrichmentRequest = (state, { action, id }) =>
    getRequest(state, {
        url: `/api/enrichment/schedule/${action}/${id}`,
        method: 'POST',
    });

export const getCreateSubresourceRequest = (state, body) =>
    getRequest(state, {
        url: '/api/subresource',
        method: 'POST',
        body,
    });

export const getCreateEnrichmentRequest = (state, body) =>
    getRequest(state, {
        url: '/api/enrichment',
        method: 'POST',
        body,
    });

export const getUpdateEnrichmentRequest = (state, { enrichment }) =>
    getRequest(state, {
        url: `/api/enrichment/${enrichment._id}`,
        method: 'PUT',
        body: enrichment,
    });

export const getDeleteEnrichmentRequest = (state, { id }) =>
    getRequest(state, {
        url: `/api/enrichment/${id}`,
        method: 'DELETE',
    });

export const getUpdateSubresourceRequest = (state, { _id, ...body }) =>
    getRequest(state, {
        url: `/api/subresource/${_id}`,
        method: 'PUT',
        body,
    });

export const getDeleteSubresourceRequest = (state, id) =>
    getRequest(state, {
        url: `/api/subresource/${id}`,
        method: 'DELETE',
    });

export const getLoadFieldRequest = state =>
    getRequest(state, {
        url: '/api/field',
    });

export const getCreateFieldRequest = (state, fieldData) =>
    getRequest(state, {
        url: '/api/field',
        body: fieldData,
        method: 'POST',
    });

export const getUpdateFieldRequest = (state, { _id, ...fieldData }) =>
    getRequest(state, {
        url: `/api/field/${_id}`,
        body: fieldData,
        method: 'PUT',
    });

export const getSaveFieldRequest = (state, fieldData) => {
    if (fieldData.name === 'new') {
        return getCreateFieldRequest(state, omit(fieldData, ['name']));
    }

    return getUpdateFieldRequest(state, fieldData);
};

export const getRemoveFieldRequest = (state, { _id }) =>
    getRequest(state, {
        url: `/api/field/${_id}`,
        method: 'DELETE',
    });

export const getLoadParsingResultRequest = state =>
    getRequest(state, {
        url: '/api/parsing',
    });

export const getPublishRequest = state =>
    getRequest(state, {
        url: '/api/publish',
        method: 'POST',
    });

export const getClearPublishedRequest = state =>
    getRequest(state, {
        url: '/api/publish',
        method: 'DELETE',
    });

export const getLoadRemovedResourcePageRequest = (state, { page, perPage }) =>
    getRequest(state, {
        url: `/api/publishedDataset/removed?page=${encodeURIComponent(
            page,
        )}&perPage=${encodeURIComponent(perPage)}`,
    });

export const getRestoreResourceRequest = (state, uri) =>
    getRequest(state, {
        url: '/api/publishedDataset/restore',
        body: { uri },
        method: 'PUT',
    });

export const getUpdateCharacteristicsRequest = (state, newCharacteristics) =>
    getRequest(state, {
        url: '/api/characteristic',
        method: 'PUT',
        body: newCharacteristics,
    });

export const getAddCharacteristicRequest = (state, newCharacteristics) =>
    getRequest(state, {
        url: '/api/characteristic',
        method: 'POST',
        body: newCharacteristics,
    });

export const getLoadDatasetPageRequest = (state, params = {}) => {
    const paramString = getQueryString(params);

    return getRequest(state, {
        url: `/api/publishedDataset?${paramString}`,
    });
};

export const getLoadPublicationRequest = state =>
    getRequest(state, {
        url: '/api/publication',
    });

export const getLoadResourceRequest = (state, uri) =>
    getRequest(state, {
        url: `/api/publishedDataset/ark?uri=${encodeURIComponent(
            uri,
        )}&applyFormat=true`,
    });

export const getSaveResourceRequest = (state, { resource, field }) =>
    getRequest(state, {
        url: '/api/publishedDataset',
        method: 'PUT',
        body: {
            resource,
            field,
        },
    });

export const getHideResourceRequest = (state, data) =>
    getRequest(state, {
        url: '/api/publishedDataset',
        method: 'DELETE',
        body: data,
    });

export const getClearDatasetRequest = state =>
    getRequest(state, {
        url: '/api/dataset',
        method: 'DELETE',
    });

export const getDumpDatasetRequest = state =>
    getRequest(state, {
        url: '/api/dump',
        method: 'GET',
    });

export const getAddFieldToResourceRequest = (state, data) =>
    getRequest(state, {
        url: '/api/publishedDataset/add_field',
        method: 'PUT',
        body: data,
    });

export const getCreateResourceRequest = (state, data) =>
    getRequest(state, {
        url: '/api/publishedDataset',
        method: 'POST',
        body: data,
    });

export const getExportFieldsRequest = state =>
    getRequest(state, {
        url: '/api/field/export',
    });

export const getExportFieldsReadyRequest = state =>
    getRequest(state, {
        url: '/api/field/export/ready',
    });

export const getLoadFacetValuesRequest = (
    state,
    { field, filter, currentPage = 0, perPage = 10, sort = {} },
) =>
    getRequest(state, {
        url: `/api/facet/${field}/${filter || ''}?${getQueryString({
            page: currentPage,
            perPage,
            sort,
        })}`,
    });

export const getChangeFieldStatusRequest = (state, { uri, field, status }) =>
    getRequest(state, {
        method: 'PUT',
        url: `/api/publishedDataset/${encodeURIComponent(
            uri,
        )}/change_contribution_status/${field}/${status}`,
    });

export const getLoadExportersRequest = state =>
    getRequest(state, {
        url: '/api/export',
    });

export const getClearUploadRequest = state =>
    getRequest(state, {
        method: 'DELETE',
        url: '/api/upload/clear',
    });

export const getUploadUrlRequest = (state, { url, loaderName }) =>
    getRequest(state, {
        method: 'POST',
        url: '/api/upload/url',
        body: {
            url,
            loaderName,
        },
    });

export const getUrlRequest = (state, { url, queryString }) =>
    getRequest(state, {
        method: 'GET',
        url: `${url}${queryString ? `?${queryString}` : ''}`,
    });

export const getSparqlRequest = (state, { url, body }) => {
    return getRequest(state, {
        body,
        method: 'POST',
        url: url,
        cred: 'omit',
        cook: false,
        auth: false,
        head: {
            Accept: 'application/sparql-results+json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
};

export const getIstexRequest = (state, { url }) => {
    return getRequest(state, {
        method: 'GET',
        url,
        cred: 'omit',
        cook: false,
        auth: false,
        head: {
            Accept: 'application/sparql-results+json',
        },
    });
};

export const getExportPublishedDatasetRequest = (
    state,
    { type, queryString },
) =>
    getRequest(state, {
        method: 'GET',
        url: `/api/export/${type}?${queryString}`,
    });

export const getReorderFieldRequest = (state, fields) =>
    getRequest(state, {
        method: 'PUT',
        url: '/api/field/reorder',
        body: {
            fields: fields.map(({ name }) => name),
        },
    });

export const getProgressRequest = state =>
    getRequest(state, {
        method: 'GET',
        url: '/api/progress',
    });

export const getBreadcrumbRequest = state =>
    getRequest(state, {
        method: 'GET',
        url: '/api/breadcrumb',
    });

export const getMenuRequest = state =>
    getRequest(state, {
        method: 'GET',
        url: '/api/menu',
    });

export const getLoadLoadersRequest = state =>
    getRequest(state, {
        url: '/api/loader',
    });

export const selectors = {
    isAdmin,
    getRole,
    getToken,
    getCookie,
    getRequest,
    isUserModalShown,
    getLoginRequest,
    getClearUploadRequest,
    getClearDatasetRequest,
    getClearPublishedRequest,
    getLoadExportersRequest,
    getChangeFieldStatusRequest,
    getLoadFacetValuesRequest,
    getExportFieldsRequest,
    getDumpDatasetRequest,
    getExportFieldsReadyRequest,
    getCreateResourceRequest,
    getUpdateSubresourceRequest,
    getAddFieldToResourceRequest,
    getHideResourceRequest,
    getSaveResourceRequest,
    getLoadResourceRequest,
    getLoadPublicationRequest,
    getLoadDatasetPageRequest,
    getAddCharacteristicRequest,
    getUpdateCharacteristicsRequest,
    getRestoreResourceRequest,
    getLoadRemovedResourcePageRequest,
    getPublishRequest,
    getLoadParsingResultRequest,
    getRemoveFieldRequest,
    getSaveFieldRequest,
    getUpdateFieldRequest,
    getCreateFieldRequest,
    getLoadSubresourcesRequest,
    getLoadEnrichmentsRequest,
    getCreateSubresourceRequest,
    getCreateEnrichmentRequest,
    getUpdateEnrichmentRequest,
    getDeleteEnrichmentRequest,
    getScheduleDatasetEnrichmentRequest,
    getLoadFieldRequest,
    getUploadUrlRequest,
    getUrlRequest,
    getExportPublishedDatasetRequest,
    getSparqlRequest,
    getReorderFieldRequest,
    getProgressRequest,
    getIstexRequest,
    getDeleteSubresourceRequest,
    getMenuRequest,
    getBreadcrumbRequest,
    getLoadLoadersRequest,
};
