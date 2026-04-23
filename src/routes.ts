import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import { authRouter } from './modules/auth/auth.router';
import { slotsRouter } from './modules/slots/slots.router';
import { usersRouter } from './modules/users/users.router';
import { bookingRouter } from './modules/booking/booking.router';

export function registerRoutes(app: Express): void {
  app.get('/', (_, res): void => {
    res.status(200).json({ message: 'Hello TS Express' });
  });

  app.use('/auth', authRouter);
  app.use('/users', usersRouter);
  app.use('/slots', slotsRouter);
  app.use('/bookings', bookingRouter);

  app.get('/docs/openapi.json', (_, res): void => {
    res.status(200).json(swaggerSpec);
  });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.all('/{*splat}', (_, res): void => {
    res.status(404).json({ message: 'Route not found' });
  });
}
