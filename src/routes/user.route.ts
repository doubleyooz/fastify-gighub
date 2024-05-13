import {
    FastifyInstance,
    FastifyPluginCallback,
    FastifyPluginOptions,
} from 'fastify';
import UserController from '../controllers/user.controller';
import AuthMiddleware from '../middlewares/auth.middleware';
import UserSchema from '../schemas/user.schema';
import UserMiddleware from '../middlewares/user.middleware';

const app: FastifyPluginCallback = (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void,
) => {
    fastify.post(`/users`, {
        schema: UserSchema.store,
        preHandler: UserMiddleware.trimFields,
        handler: UserController.store,
    });

    fastify.get(`/users`, {
        preValidation: AuthMiddleware.auth,
        schema: UserSchema.find,
        handler: UserController.find,
    });

    fastify.get(`/users/:_id`, {
        schema: UserSchema.findOne,
        preHandler: AuthMiddleware.auth,
        handler: UserController.findOne,
    });

    fastify.put(`/users`, {
        schema: UserSchema.update,
        preHandler: AuthMiddleware.auth,
        handler: UserController.update,
    });

    fastify.delete(`/users`, {
        schema: UserSchema._delete,
        preHandler: AuthMiddleware.auth,
        handler: UserController._delete,
    });
    done();
};

export default app;
