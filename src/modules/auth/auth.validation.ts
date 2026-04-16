import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, 'Email must be at most 254 characters')
  .pipe(
    z.email('Invalid email').meta({
      description: 'User email address used for authentication',
      example: 'john@example.com',
    })
  );
const passwordSchema = z
  .string()
  .min(3, 'Password must be at least 3 characters')
  .max(24, 'Password must be at most 24 characters')
  .regex(/^[A-Za-z0-9_-]+$/, 'Password may contain only latin letters, numbers, "_" and "-"')
  .meta({
    description: 'User password',
    example: 'secret123',
    format: 'password',
  });

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .meta({
    description: 'Payload for user registration',
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .meta({
    description: 'Payload for user login',
  })
  .strict();

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
