import {
    FastifyInstance,
    FastifyPluginCallback,
    FastifyPluginOptions,
} from 'fastify';
import SkillController from '../controllers/skill.controller';
import AuthMiddleware from '../middlewares/auth.middleware';
import SkillSchema from '../schemas/skill.schema';
import { IsObjectId } from '../utils/schema.util';

const app: FastifyPluginCallback = (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void,
) => {
    fastify.post(`/skills`, {
        preValidation: AuthMiddleware.auth,
        schema: SkillSchema.store,
        handler: SkillController.store,
    });

    fastify.get(`/skills`, {
        schema: SkillSchema.find,
        preHandler: AuthMiddleware.auth,
        handler: SkillController.find,
    });

    fastify.get(`/skills/:_id`, {
        schema: SkillSchema.findOne,
        preValidation: async (request, reply) => {
            const { _id } = request.params as { _id: string };
            if (!IsObjectId(_id)) {
                reply.code(400).send({ error: 'Invalid ObjectId' });
            }
        },
        preHandler: AuthMiddleware.auth,
        handler: SkillController.findOne,
    });

    fastify.put(`/skills/:_id`, {
        schema: SkillSchema.update,
        preHandler: AuthMiddleware.auth,
        handler: SkillController.update,
    });
    done();
};

export default app;
