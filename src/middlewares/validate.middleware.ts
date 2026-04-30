import { Request, RequestHandler, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ZodType } from 'zod';
import { formatZodError } from '../utils/zod';
import { ApiError } from '../utils/api-error';

export const validateBody =
  <T extends ZodType>(schema: T): RequestHandler<ParamsDictionary, unknown, T['_output']> =>
  (req: Request<ParamsDictionary, unknown, T['_output']>, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(ApiError.badRequest('Validation failed', formatZodError(result.error)));
    }

    req.body = result.data;
    next();
  };

export const validateQuery =
  <T extends ZodType>(schema: T): RequestHandler<ParamsDictionary, unknown, unknown, T['_output']> =>
  (req: Request<ParamsDictionary, unknown, unknown, T['_output']>, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return next(ApiError.badRequest('Validation failed', formatZodError(result.error)));
    }

    req.query = result.data;
    next();
  };
