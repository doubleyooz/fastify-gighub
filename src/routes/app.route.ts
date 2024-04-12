import {
    FastifyInstance,
    FastifyPluginCallback,
    FastifyPluginOptions,
    FastifyReply,
    FastifyRequest,
} from 'fastify';

const app: FastifyPluginCallback = (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void,
) => {
    fastify.get(`/`, {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        data: { type: 'string', pattern: '^Hello World!$' },
                    },
                },
            },
        },
        handler: (req: FastifyRequest, reply: FastifyReply) => {
            return reply.send({ data: 'Hello World' });
        },
    });
    done();
};

export default app;
