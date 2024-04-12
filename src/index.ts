import { app } from './config/fastify.config';

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const start = async () => {
    try {
        console.log({ port: PORT });
        await app.listen({ port: PORT });
    } catch (error) {
        console.log(error);
        app.log.error(error);
        process.exit(1);
    }
};

start();
