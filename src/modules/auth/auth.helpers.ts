import { ApiError } from '../../utils/api-error';
import type { AccessTokenPayload } from '../../utils/jwt/types';
import type { AuthenticatedRequest } from './auth.request.types';

export const getAuthUser = (req: AuthenticatedRequest): AccessTokenPayload => {
  if (!req.user) throw ApiError.unauthorized('Missing bearer token');
  return req.user;
};
