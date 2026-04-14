import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';

export const errorMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction): Response => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    });
  }

  console.error(err);

  return res.status(500).json({
    message: 'Internal server error',
  });
};
