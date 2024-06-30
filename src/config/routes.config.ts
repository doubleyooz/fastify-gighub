import { FastifyPluginOptions, type FastifyInstance } from 'fastify';
import appRoute from '../routes/app.route';
import authRoute from '../routes/auth.route';
import gigRoute from '../routes/gig.route';
import propositionRoute from '../routes/proposition.route';
import skillRoute from '../routes/skill.route';
import uploadRoute from '../routes/upload.route';
import userRoute from '../routes/user.route';

const app = (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void,
) => {
    fastify.register(appRoute);
    fastify.register(skillRoute);
    fastify.register(gigRoute);
    fastify.register(propositionRoute);
    fastify.register(userRoute);
    fastify.register(authRoute);
    fastify.register(uploadRoute);
    done();
};

export default app;
