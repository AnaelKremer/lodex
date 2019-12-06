import 'babel-polyfill';
import 'url-api-polyfill';

import React from 'react';
import { render } from 'react-dom';

import rootReducer from './reducers';
import Routes from './Routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import { createHashHistory } from 'history';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import scrollToTop from '../lib/scrollToTop';
import { ConnectedRouter } from 'connected-react-router';

import theme from '../theme';

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: theme.orange.primary,
        primary1Color: theme.green.primary,
        primary2Color: theme.purple.primary,
        textColor: '#5F6368',
    },
});

const history = createHashHistory();
const store = configureStore(rootReducer, sagas, {}, history);

render(
    <Provider {...{ store }}>
        <MuiThemeProvider muiTheme={muiTheme}>
            <ConnectedRouter history={history} onUpdate={scrollToTop}>
                <Routes />
            </ConnectedRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
