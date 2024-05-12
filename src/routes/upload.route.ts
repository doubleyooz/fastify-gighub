import {
    FastifyInstance,
    FastifyPluginCallback,
    FastifyPluginOptions,
} from 'fastify';

import UploadController from '../controllers/upload.controller';

import AuthMiddleware from '../middlewares/auth.middleware';
import UploadSchema from '../schemas/upload.schema';

const app: FastifyPluginCallback = (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void,
) => {
    fastify.post('/upload', {
        preValidation: AuthMiddleware.auth,
        schema: UploadSchema.uploadProfilePicture,
        handler: UploadController.updateProfilePicture,
    });

    done();
};

export default app;
