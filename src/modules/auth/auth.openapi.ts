import { z } from 'zod';
import { openApiRegistry } from '../../docs/openapi-registry';
import { loginSchema, registerSchema } from './auth.validation';
import { PublicUserSchema } from '../users/users.openapi';

const refreshCookieExample =
  'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh.payload.signature; Path=/auth/refresh; HttpOnly; SameSite=Lax';

openApiRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

openApiRegistry.registerComponent('securitySchemes', 'refreshTokenCookie', {
  type: 'apiKey',
  in: 'cookie',
  name: 'refreshToken',
});

const RegisterDtoSchema = openApiRegistry.register('RegisterDto', registerSchema);
const LoginDtoSchema = openApiRegistry.register('LoginDto', loginSchema);

const AuthResponseDtoSchema = openApiRegistry.register(
  'AuthResponseDto',
  z.object({
    user: PublicUserSchema,
    accessToken: z.string().meta({
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access.payload.signature',
    }),
  })
);

const AccessTokenResponseDtoSchema = openApiRegistry.register(
  'AccessTokenResponseDto',
  z.object({
    accessToken: z.string().meta({
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access.payload.signature',
    }),
  })
);

const ValidationErrorDetailSchema = openApiRegistry.register(
  'ValidationErrorDetail',
  z.object({
    path: z.string().meta({ example: 'email' }),
    message: z.string().meta({ example: 'Invalid email' }),
  })
);

const ErrorResponseSchema = openApiRegistry.register(
  'ErrorResponse',
  z.object({
    message: z.string().meta({ example: 'Invalid request payload' }),
    details: z.array(ValidationErrorDetailSchema).optional(),
  })
);

const setCookieHeader = {
  schema: {
    type: 'string',
    example: refreshCookieExample,
  },
} as const;

const rotatedCookieHeader = {
  schema: {
    type: 'string',
    example: refreshCookieExample,
  },
} as const;

openApiRegistry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  operationId: 'register',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: RegisterDtoSchema,
          example: {
            email: '',
            password: '',
          },
        },
      },
    },
  },
  responses: {
    '201': {
      description: '',
      headers: {
        'Set-Cookie': setCookieHeader,
      },
      content: {
        'application/json': {
          schema: AuthResponseDtoSchema,
        },
      },
    },
    '400': {
      description: '',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    '409': {
      description: '',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

openApiRegistry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  operationId: 'login',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: LoginDtoSchema,
          example: {
            email: '',
            password: '',
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: '',
      headers: {
        'Set-Cookie': setCookieHeader,
      },
      content: {
        'application/json': {
          schema: AuthResponseDtoSchema,
        },
      },
    },
    '400': {
      description: '',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
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
  },
});

openApiRegistry.registerPath({
  method: 'post',
  path: '/auth/refresh',
  tags: ['Auth'],
  operationId: 'refresh',
  security: [{ refreshTokenCookie: [] }],
  request: {
    cookies: z.object({
      refreshToken: z.string().meta({
        param: {
          name: 'refreshToken',
          in: 'cookie',
          required: true,
        },
        example: '',
      }),
    }),
  },
  responses: {
    '200': {
      description: '',
      headers: {
        'Set-Cookie': rotatedCookieHeader,
      },
      content: {
        'application/json': {
          schema: AccessTokenResponseDtoSchema,
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
  },
});

openApiRegistry.registerPath({
  method: 'post',
  path: '/auth/logout',
  tags: ['Auth'],
  operationId: 'logout',
  request: {
    cookies: z.object({
      refreshToken: z.string().optional().meta({
        param: {
          name: 'refreshToken',
          in: 'cookie',
          required: false,
        },
        example: '',
      }),
    }),
  },
  responses: {
    '204': {
      description: '',
    },
  },
});
