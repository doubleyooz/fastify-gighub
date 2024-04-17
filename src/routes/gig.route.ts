import {
    FastifyInstance,
    FastifyPluginCallback,
    FastifyPluginOptions,
} from 'fastify';
import GigControllers from '../controllers/gig.controller';
import AuthMiddleware from '../middlewares/auth.middleware';
import GigSchema from '../schemas/gig.schema';

const app: FastifyPluginCallback = (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void,
) => {
    fastify.post(`/gigs`, {
        schema: GigSchema.store,
        preHandler: AuthMiddleware.auth,
        handler: GigControllers.store,
    });

    fastify.get(`/gigs`, {
        schema: GigSchema.find,
        preHandler: AuthMiddleware.auth,
        handler: GigControllers.find,
    });
    /*
    fastify.get(`/gigs/:_id`, {
        schema: GigSchema.findOne,
        preHandler: AuthMiddleware.auth,
        handler: GigControllers.findOne,
    });

    fastify.put(`/gigs`, {
        schema: GigSchema.update,
        preHandler: AuthMiddleware.auth,
        handler: GigControllers.update,
    });*/
    done();
};

export default app;
