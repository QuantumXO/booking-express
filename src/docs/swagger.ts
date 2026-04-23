import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { openApiRegistry } from './openapi-registry';
import '../modules/users/users.openapi';
import '../modules/auth/auth.openapi';
import '../modules/slots/slots.openapi';
import '../modules/booking/booking.openapi';

const generator = new OpenApiGeneratorV31(openApiRegistry.definitions, {
  sortComponents: 'alphabetically',
});

export const swaggerSpec = generator.generateDocument({
  openapi: '3.1.1',
  info: {
    title: 'Booking Express API',
    version: '1.0.0',
    description: 'API documentation for the Booking Express service',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication and session management endpoints',
    },
    {
      name: 'Users',
      description: 'User profile endpoints',
    },
    {
      name: 'Slots',
      description: 'Slot management endpoints',
    },
    {
      name: 'Bookings',
      description: 'Booking management endpoints',
    },
  ],
});
