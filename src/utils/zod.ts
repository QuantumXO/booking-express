import { ZodError } from 'zod';

export const formatZodError = (error: ZodError) => {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
};
