import express from 'express';
import cors from 'cors';
//import cookieParser from 'cookie-parser';

import corsOptions from './cors.config';

import appRoute from '../routes/app.route';

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(cookieParser());
//app.use(cors());
app.use(cors(corsOptions));

app.use(appRoute);

export { app };
