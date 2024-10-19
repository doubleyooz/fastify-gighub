import {
    FastifyInstance,
    FastifyPluginCallback,
    FastifyPluginOptions,
} from 'fastify';
import GigControllers from '../controllers/gig.controller';
import AuthMiddleware from '../middlewares/auth.middleware';
import GigSchema from '../schemas/gig.schema';
import { IsObjectId } from '../utils/schema.util';
import GigMiddleware from '../middlewares/gig.middleware';

const app: FastifyPluginCallback = (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void,
) => {
    fastify.post(`/gigs`, {
        preValidation: AuthMiddleware.auth,
        schema: GigSchema.store,
        preHandler: GigMiddleware.trimFields,
        handler: GigControllers.store,
    });

    fastify.get(`/gigs`, {
        schema: GigSchema.find,
        preHandler: AuthMiddleware.auth,
        handler: GigControllers.find,
    });

    fastify.get(`/gigs/:_id`, {
        schema: GigSchema.findOne,
        preValidation: async (request, reply) => {
            const { _id } = request.params as { _id: string };
            if (!IsObjectId(_id)) {
                reply.code(400).send({ error: 'Invalid ObjectId' });
            }
        },
        preHandler: AuthMiddleware.auth,
        handler: GigControllers.findOne,
    });

    fastify.put(`/gigs/:_id`, {
        schema: GigSchema.update,
        preHandler: AuthMiddleware.auth,
        handler: GigControllers.update,
    });
    done();
};

export default app;
