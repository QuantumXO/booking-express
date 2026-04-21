import { z } from 'zod';
import { openApiRegistry } from '../../docs/openapi-registry';
import { UserRoles } from './users.types';

export const PublicUserSchema = openApiRegistry.register(
  'PublicUserDto',
  z.object({
    id: z.string().uuid().meta({
      example: '0f7fd8de-b2c3-4cc9-9a2a-f09f1d3ef2ef',
    }),
    email: z.string().email().meta({
      example: 'john@example.com',
    }),
    roles: z.array(z.enum(Object.values(UserRoles) as [UserRoles, ...UserRoles[]])).meta({
      example: [UserRoles.CONTRACTOR],
    }),
    createdAt: z.iso.datetime().meta({
      example: '2026-04-17T09:30:00.000Z',
    }),
    updatedAt: z.iso.datetime().meta({
      example: '2026-04-17T09:30:00.000Z',
    }),
  }),
);

const ErrorResponseSchema = openApiRegistry.register(
  'UsersErrorResponse',
  z.object({
    message: z.string().meta({ example: 'User not found' }),
  }),
);

openApiRegistry.registerPath({
  method: 'get',
  path: '/users/me',
  tags: ['Users'],
  operationId: 'getCurrentUser',
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: 'Authorization',
      in: 'header',
      required: true,
      schema: {
        type: 'string',
        example: '',
      },
    },
  ],
  responses: {
    '200': {
      description: '',
      content: {
        'application/json': {
          schema: PublicUserSchema,
        },
      },
    },
    '401': {
      description: '',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    '404': {
      description: '',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});
