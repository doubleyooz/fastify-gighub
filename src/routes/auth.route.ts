import {
    FastifyInstance,
    FastifyPluginCallback,
    FastifyPluginOptions,
} from 'fastify';
import AuthController from '../controllers/auth.controller';
import AuthMiddleware from '../middlewares/auth.middleware';
import AuthSchema from '../schemas/auth.schema';

const app: FastifyPluginCallback = (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void,
) => {
    fastify.get(`/sign-in`, {
        schema: AuthSchema.signIn,
        handler: AuthController.signIn,
    });

    fastify.get(`/revoke-token`, {
        schema: AuthSchema.revokeToken,
        handler: AuthController.revokeRefreshToken,
    });

    fastify.get(`/refresh-token`, {
        schema: AuthSchema.refreshToken,
        handler: AuthController.refreshAccessToken,
    });

    fastify.get(`/me`, {
        preValidation: AuthMiddleware.auth,
        schema: AuthSchema.me,
        handler: AuthController.me,
    });

    fastify.get(`/message`, {
        schema: AuthSchema.authGetMessage,
        handler: AuthController.generateMessage,
    });

    fastify.post(`/register-wallet`, {
        preValidation: AuthMiddleware.auth,
        schema: AuthSchema.metaSignIn,
        handler: AuthController.registerWallet,
    });

    fastify.post(`/metamask`, {
        schema: AuthSchema.metaSignIn,
        handler: AuthController.authMetamask,
    });

    done();
};

export default app;
