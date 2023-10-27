import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';
import jwt from 'koa-jwt';
import { auth } from 'config';
import { ObjectId } from 'mongodb';
import { createWorkerQueue, deleteWorkerQueue } from '../workers';
import { ROOT_ROLE, checkForbiddenNames } from '../../common/tools/tenantTools';

import bullBoard from '../bullBoard';

const app = new Koa();
app.use(
    jwt({
        secret: auth.cookieSecret,
        cookie: 'lodex_token_root',
        key: 'cookie',
        passthrough: true,
    }),
);
app.use(jwt({ secret: auth.headerSecret, key: 'header', passthrough: true }));

app.use(async (ctx, next) => {
    if (!ctx.state.cookie) {
        ctx.status = 401;
        ctx.cookies.set('lodex_token_root', '', { expires: new Date() });
        ctx.body = { message: 'No authentication token found' };
        return;
    }

    if (ctx.state.cookie.role !== ROOT_ROLE) {
        ctx.status = 401;
        ctx.cookies.set('lodex_token_root', '', { expires: new Date() });
        ctx.body = { message: 'No root token found' };
        return;
    }

    await next();
});

app.use(koaBodyParser());

const getTenant = async ctx => {
    ctx.body = await ctx.tenantCollection.findAll();
};

const postTenant = async ctx => {
    const { name, description, author } = ctx.request.body;
    const tenantExists = await ctx.tenantCollection.count({ name });
    if (tenantExists || checkForbiddenNames(name)) {
        ctx.status = 403;
        ctx.body = { error: `Invalid name: "${name}"` };
    } else {
        await ctx.tenantCollection.create({
            name,
            description,
            author,
            username: 'admin',
            password: 'secret',
            createdAt: new Date(),
        });
        const queue = createWorkerQueue(name, 1);
        bullBoard.addDashboardQueue(name, queue);
        ctx.body = await ctx.tenantCollection.findAll();
    }
};

const putTenant = async (ctx, id) => {
    const { description, author, username, password } = ctx.request.body;
    const tenantExists = await ctx.tenantCollection.findOneById(id);

    if (!tenantExists) {
        ctx.throw(403, `Invalid id: "${id}"`);
    }

    const update = { description, author, username, password };
    await ctx.tenantCollection.update(id, update);
    ctx.body = await ctx.tenantCollection.findAll();
};

const deleteTenant = async ctx => {
    const { _id, name } = ctx.request.body;
    const tenantExists = await ctx.tenantCollection.findOne({
        _id: new ObjectId(_id),
        name,
    });
    if (!tenantExists || name !== tenantExists.name) {
        ctx.status = 403;
        ctx.body = { error: `Invalid name: "${name}"` };
    } else {
        deleteWorkerQueue(tenantExists.name);
        bullBoard.removeDashboardQueue(tenantExists.name);
        await ctx.tenantCollection.deleteOne(tenantExists);
        ctx.body = await ctx.tenantCollection.findAll();
    }
};

app.use(route.get('/tenant', getTenant));
app.use(route.post('/tenant', postTenant));
app.use(route.put('/tenant/:id', putTenant));
app.use(route.delete('/tenant', deleteTenant));

app.use(async ctx => {
    ctx.status = 404;
});

export default app;
