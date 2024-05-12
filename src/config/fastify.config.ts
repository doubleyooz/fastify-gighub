import fastify from 'fastify';
import mongoose from 'mongoose';

import cors from '@fastify/cors';
import multipart from '@fastify/multipart';

import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie';

import multerConfig from '../config/multer.config';
import jwtConfig from '../config/jwt.config';
import appRoutes from '../config/routes.config';
//const app = fastify({ logger: true, ajv: { plugins: [ajvPlugin] } });

const app = fastify({ logger: true });
app.register(cors, {
    origin: [`${process.env.CLIENT}`, `${process.env.CLIENT2}`],
    credentials: true,
});

app.register(multipart, multerConfig);

//app.register(swagger, swaggerConfig);

mongoose.connect(`${process.env.DB_CONNECTION}`);

app.register(fastifyCookie, {
    hook: 'onRequest',
    parseOptions: {},
} as FastifyCookieOptions);

app.register(jwtConfig);
app.register(appRoutes);

export { app };
