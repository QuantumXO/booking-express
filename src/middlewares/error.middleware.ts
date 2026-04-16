import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { logger } from '../utils/logger';

export const errorMiddleware = (err: unknown, req: Request, res: Response, _next: NextFunction): Response => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    });
  }

  if (req.log) {
    req.log.error({ err }, 'Unhandled request error');
  } else {
    logger.error({ err }, 'Unhandled request error');
  }

  return res.status(500).json({
    message: 'Internal server error',
  });
};
