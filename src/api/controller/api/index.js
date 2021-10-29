import Koa from 'koa';
import route from 'koa-route';
import mount from 'koa-mount';
import jwt from 'koa-jwt';
import { auth } from 'config';
import get from 'lodash.get';

import ezMasterConfig from '../../services/ezMasterConfig';
import characteristic from './characteristic';
import exportPublishedDataset from './export';
import facet from './facet';
import fieldRoutes from './field';
import login from './login';
import parsing from './parsing';
import publication from './publication';
import publish from './publish';
import publishedDataset from './publishedDataset';
import dataset from './dataset';
import upload from './upload';
import run from './run';
import progress from './progress';
import breadcrumbs from './breadcrumb';
import menu from './menu';
import loader from './loader';
import translate from './translate';
import subresource from './subresource';
import enrichment from './enrichment';
import dump from './dump';

const app = new Koa();

app.use(ezMasterConfig);

app.use(mount('/login', login));
app.use(route.get('/breadcrumb', breadcrumbs));
app.use(route.get('/menu', menu));
app.use(mount('/translations', translate));

app.use(
    jwt({
        secret: auth.cookieSecret,
        cookie: 'lodex_token',
        key: 'cookie',
        passthrough: true,
    }),
);
app.use(jwt({ secret: auth.headerSecret, key: 'header', passthrough: true }));

app.use(async (ctx, next) => {
    if (
        get(ctx, 'state.cookie.role') === 'admin' &&
        get(ctx, 'state.header.role') === 'admin'
    ) {
        ctx.state.isAdmin = true;
    }
    if (!ctx.ezMasterConfig.userAuth) {
        return next();
    }
    if (!ctx.state.cookie || !ctx.state.header) {
        ctx.status = 401;
        ctx.cookies.set('lodex_token', '', { expires: new Date() });
        ctx.body = 'No authentication token found';
        return;
    }

    await next();
});

app.use(mount('/export', exportPublishedDataset));
app.use(mount('/facet', facet));
app.use(mount('/run', run));
app.use(route.get('/publication', publication));
app.use(mount('/publishedDataset', publishedDataset));

app.use(async (ctx, next) => {
    if (!ctx.state.cookie || !ctx.state.header) {
        ctx.status = 401;
        ctx.cookies.set('lodex_token', '', { expires: new Date() });
        ctx.body = 'No authentication token found';
        return;
    }

    if (
        get(ctx, 'state.cookie.role') === 'user' &&
        get(ctx, 'state.header.role') === 'user'
    ) {
        ctx.status = 404;
        return;
    }

    if (
        get(ctx, 'state.cookie.role') !== 'admin' ||
        get(ctx, 'state.header.role') !== 'admin'
    ) {
        ctx.status = 403;
        ctx.body = 'Forbidden';
        return;
    }

    await next();
});
app.use(mount('/characteristic', characteristic));
app.use(mount('/field', fieldRoutes));
app.use(mount('/subresource', subresource));
app.use(mount('/enrichment', enrichment));
app.use(mount('/parsing', parsing));
app.use(mount('/publish', publish));
app.use(mount('/upload', upload));
app.use(mount('/dataset', dataset));
app.use(route.get('/progress', progress));
app.use(mount('/loader', loader));
app.use(route.get('/dump', dump));

app.use(async ctx => {
    ctx.status = 404;
});

export default app;
