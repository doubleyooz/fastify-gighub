import fastify from 'fastify';
import mongoose from 'mongoose';

import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fastifyjwt, { VerifyOptions, FastifyJwtSignOptions } from '@fastify/jwt';
import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie';

import multerConfig from '../config/multer.config';
import jwtConfig from '../config/jwt.config';
import appRoutes from '../config/routes.config';
import path from 'node:path';
//const app = fastify({ logger: true, ajv: { plugins: [ajvPlugin] } });

const app = fastify({ logger: true });
app.register(cors, {
    origin: [`${process.env.CLIENT}`, `${process.env.CLIENT2}`],
    credentials: true,
});

app.register(multipart, multerConfig);

//app.register(swagger, swaggerConfig);

mongoose.connect(`${process.env.DB_CONNECTION}`);

app.register(fastifyCookie, {
    hook: 'onRequest',
    parseOptions: {},
} as FastifyCookieOptions);

app.register(fastifyjwt, {
    secret: `${process.env.REFRESH_TOKEN_SECRET}`,
    namespace: 'refresh',
    cookie: {
        cookieName: 'jid',
        signed: false,
    },

    sign: {
        expiresIn: `${process.env.REFRESH_TOKEN_EXPIRATION}`,
    },
});
app.register(fastifyjwt, {
    secret: `${process.env.ACCESS_TOKEN_SECRET}`,
    namespace: 'access',

    decode: { complete: true },
    sign: { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRATION}` },
});

app.register(fastifyjwt, {
    secret: `${process.env.MESSAGE_TOKEN_SECRET}`,
    namespace: 'message',

    sign: { expiresIn: `${process.env.MESSAGE_TOKEN_EXPIRATION}` },
});

app.register(appRoutes);
app.register(fastifyStatic, {
    root: path.join(__dirname, '..', '..', 'public'),
    prefix: '/public/', // optional: default '/'
});

export { app };
