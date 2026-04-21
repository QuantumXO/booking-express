import { NextFunction, Response } from 'express';
import { ApiError } from '../utils/api-error';
import { verifyAccessToken } from '../utils/jwt';
import type { AuthenticatedRequest } from '../modules/auth/auth.request.types';
import { usersRepository } from '../modules/users/users.repository';
import { UserRoles, UserStatuses } from '../modules/users/users.types';

export const requireAuth = async (req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(ApiError.unauthorized('Missing bearer token'));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);

    if (payload.type !== 'access') {
      next(ApiError.unauthorized('Invalid token type'));
      return;
    }

    const user = await usersRepository.findById(payload.sub);

    if (!user) {
      next(ApiError.unauthorized('User not found'));
      return;
    }

    if (user.status !== UserStatuses.ACTIVE) {
      next(ApiError.forbidden('User is blocked'));
      return;
    }

    req.auth = payload;
    req.user = user;
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired access token'));
  }
};

export const requireAnyRole = (roles: UserRoles[]) => {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) return next(ApiError.unauthorized('Missing bearer token'));

      const user = req.user ?? (await usersRepository.findById(req.auth.sub));
      if (!user) return next(ApiError.unauthorized('User not found'));
      if (user.status !== UserStatuses.ACTIVE) return next(ApiError.forbidden('User is blocked'));

      const hasRole = roles.some((role) => user.roles.includes(role));

      if (!hasRole) return next(ApiError.forbidden('Insufficient permissions'));

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireAdmin = requireAnyRole([UserRoles.ADMIN]);
export const requireSystemRole = requireAnyRole([UserRoles.ADMIN, UserRoles.CONTRACTOR]);
