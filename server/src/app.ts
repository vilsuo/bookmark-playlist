import 'reflect-metadata';

import express from 'express';
import 'express-async-errors';

import router from './router';
import { errorHandler, requestLogger } from './util/middleware';

const app = express();

app.use(express.json());

app.use(requestLogger);

app.use('/api', router);

app.use(errorHandler);

export default app;
