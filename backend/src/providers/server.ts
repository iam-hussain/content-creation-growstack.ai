import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';

import env from '@/providers/env-config';
import contentRouter from '@/routes/content';
import healthCheckRouter from '@/routes/health-check';
import { handleErrorResponse, handleNotFound } from '@/utils/error-handler';
import requestLogger from '@/utils/request-logger';

const app: Express = express();

// request logging
app.use(requestLogger());

// security middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

// parse application/x-www-form-urlencoded
app.use(express.json());

// routes
app.use('/', healthCheckRouter);
app.use('/content', contentRouter);

// error handlers
app.use(handleNotFound);

// 404 handlers
app.use(handleErrorResponse);

export default app;
