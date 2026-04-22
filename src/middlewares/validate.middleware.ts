import { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { formatZodError } from '../utils/zod';
import { ApiError } from '../utils/api-error';

export const validateBody =
  <T extends ZodType>(schema: T) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(ApiError.badRequest('Validation failed', formatZodError(result.error)));
    }

    req.body = result.data;
    next();
  };

export const validateQuery =
  <T extends ZodType>(schema: T) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return next(ApiError.badRequest('Validation failed', formatZodError(result.error)));
    }

    (req as Request<any, any, any, any>).query = result.data;
    next();
  };
