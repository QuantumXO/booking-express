import { Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { verifyAccessToken } from '../utils/jwt';
import type { AuthenticatedRequest } from '../modules/auth/auth.request-types';

export const requireAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Missing bearer token'));
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);

    if (payload.type !== 'access') {
      return next(ApiError.unauthorized('Invalid token type'));
    }

    req.user = payload;
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired access token'));
  }
};
