import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyjwt, { VerifyOptions, FastifyJwtSignOptions } from '@fastify/jwt';

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

const app = (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void,
) => {
    fastify.register(fastifyjwt, {
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
    fastify.register(fastifyjwt, {
        secret: `${process.env.ACCESS_TOKEN_SECRET}`,
        namespace: 'access',

        decode: { complete: true },
        sign: { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRATION}` },
    });

    fastify.register(fastifyjwt, {
        secret: `${process.env.MESSAGE_TOKEN_SECRET}`,
        namespace: 'message',

        sign: { expiresIn: `${process.env.MESSAGE_TOKEN_EXPIRATION}` },
    });
    done();
};

export default app;
