import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password is too long').meta({
    format: 'password',
  }),
});

export const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required').meta({
    format: 'password',
  }),
});

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
