import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, 'Email must be at most 254 characters')
  .pipe(z.email('Invalid email'));
const passwordSchema = z
  .string()
  .min(3, 'Password must be at least 3 characters')
  .max(24, 'Password must be at most 24 characters')
  .regex(/^[A-Za-z0-9_-]+$/, 'Password may contain only latin letters, numbers, "_" and "-"')
  .meta({ format: 'password' });

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
