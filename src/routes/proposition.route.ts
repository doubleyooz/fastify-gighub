import {
    FastifyInstance,
    FastifyPluginCallback,
    FastifyPluginOptions,
} from 'fastify';
import PropositionController from '../controllers/proposition.controller';
import AuthMiddleware from '../middlewares/auth.middleware';
import PropositionSchema from '../schemas/proposition.schema';
import { IsObjectId } from '../utils/schema.util';

const app: FastifyPluginCallback = (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void,
) => {
    fastify.post(`/propositions`, {
        preValidation: AuthMiddleware.auth,
        schema: PropositionSchema.store,
        handler: PropositionController.store,
    });

    fastify.post(`/gigs/:gigId`, {
        preValidation: AuthMiddleware.auth,
        schema: PropositionSchema.store,
        handler: PropositionController.store,
    });

    fastify.get(`/propositions`, {
        schema: PropositionSchema.find,
        preHandler: AuthMiddleware.auth,
        handler: PropositionController.find,
    });

    fastify.get(`/propositions/:_id`, {
        schema: PropositionSchema.findOne,
        preValidation: async (request, reply) => {
            const { _id } = request.params as { _id: string };
            if (!IsObjectId(_id)) {
                reply.code(400).send({ error: 'Invalid ObjectId' });
            }
        },
        preHandler: AuthMiddleware.auth,
        handler: PropositionController.findOne,
    });
    /*
    fastify.put(`/propositions`, {
        schema: PropositionSchema.update,
        preHandler: AuthMiddleware.auth,
        handler: PropositionController.update,
    });*/
    done();
};

export default app;
