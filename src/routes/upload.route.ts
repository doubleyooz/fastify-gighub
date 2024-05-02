import {
    FastifyInstance,
    FastifyPluginCallback,
    FastifyPluginOptions,
} from 'fastify';

import UploadController from '../controllers/upload.controller';

const app: FastifyPluginCallback = (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void,
) => {
    fastify.post('/upload', {
        handler: UploadController.updateProfilePicture,
    });

    done();
};

export default app;
