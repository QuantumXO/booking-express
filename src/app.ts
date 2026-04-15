import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import authRouter from './modules/auth/auth.routes';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.middleware';

export function createApp(): Express {
  const app: Express = express();

  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello TS Express' });
  });

  app.get('/docs/openapi.json', (req, res) => {
    res.status(200).json(swaggerSpec);
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/auth', authRouter);

  app.all('/{*splat}', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use(errorMiddleware);

  return app;
}
