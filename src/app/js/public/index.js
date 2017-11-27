import 'babel-polyfill';
import 'whatwg-fetch';
import 'url-api-polyfill';

import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';

import Root from '../Root';
import rootReducer from './reducers';
import routes from './routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import phrasesForEn from '../i18n/translations/en';

const initialState = {
    polyglot: {
        locale: 'en',
        phrases: phrasesForEn,
    },
};

const store = configureStore(
    rootReducer,
    sagas,
    window.__PRELOADED_STATE__ || initialState,
    browserHistory,
);

injectTapEventPlugin();

render(
    <Root {...{ store, routes, history: browserHistory }} />,
    document.getElementById('root'),
);

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept('../Root', () => {
        const NewRoot = require('../Root').default; // eslint-disable-line
        render(
            <NewRoot {...{ store, routes, history: browserHistory }} />,
            document.getElementById('root'),
        );
    });
}
