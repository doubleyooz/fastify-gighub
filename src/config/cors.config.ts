import cors from 'cors';

const allowedOrigins = [`${process.env.CLIENT}`];

const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
};

export default corsOptions;