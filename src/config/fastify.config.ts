import fastify from 'fastify';
import mongoose from 'mongoose';

import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyjwt, { VerifyOptions, FastifyJwtSignOptions } from '@fastify/jwt';

import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie';

import appRoute from '../routes/app.route';
import authRoute from '../routes/auth.route';
import gigRoute from '../routes/gig.route';
import propositionRoute from '../routes/proposition.route';
import userRoute from '../routes/user.route';

//const app = fastify({ logger: true, ajv: { plugins: [ajvPlugin] } });
import { Payload } from '../utils/auth.util';
declare module 'fastify' {
    interface FastifyRequest {
        accessJwtVerify(
            token: string,
            options?: VerifyOptions,
        ): Promise<Payload>;
        refreshJwtVerify(
            token: string,
            options?: VerifyOptions,
        ): Promise<Payload>;
        messageJwtVerify(
            token: string,
            options?: VerifyOptions,
        ): Promise<{ message: string }>;
        auth: string;
        newToken: string;
    }
    export interface FastifyReply {
        accessJwtSign(
            payload: string | object | Buffer,
            options?: FastifyJwtSignOptions | undefined,
        ): Promise<string>;

        refreshJwtSign(
            payload: string | object | Buffer,
            options?: FastifyJwtSignOptions | undefined,
        ): Promise<string>;

        messageJwtSign(
            payload: string | object | Buffer,
            options?: FastifyJwtSignOptions | undefined,
        ): Promise<string>;
    }
}

const app = fastify({ logger: true });
app.register(cors, {
    origin: [`${process.env.CLIENT}`, `${process.env.CLIENT2}`],
    credentials: true,
});

app.register(multipart);

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
app.register(appRoute);
app.register(gigRoute);
app.register(propositionRoute);
app.register(userRoute);
app.register(authRoute);

export { app };
