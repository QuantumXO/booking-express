import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.middleware';
import { corsMiddleware } from './middlewares/cors.middleware';
import pinoHttp from 'pino-http';
import { logger } from './utils/logger';
import { env } from './config/env';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware';
import { registerRoutes } from './routes';
import { requestSizeMiddleware } from './middlewares/request-size.middleware';

export function createApp(): Express {
  const app: Express = express();

  // Use the simple query parser to keep query params flat and predictable.
  app.set('query parser', 'simple');

  app.use(requestSizeMiddleware);

  app.use(
    pinoHttp({
      logger,
      autoLogging: env.httpLogsEnabled,
    }),
  );
  app.use(rateLimitMiddleware);
  app.use(express.json({ limit: '32kb' }));
  app.use(cookieParser());
  app.use(corsMiddleware);

  registerRoutes(app);

  app.use(errorMiddleware);

  return app;
}
