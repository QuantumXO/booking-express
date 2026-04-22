import { ApiError } from '../../utils/api-error';
import type { AccessTokenPayload } from '../../utils/jwt/types';
import type { AuthenticatedRequest } from './auth.request.types';

export const getAuth = <P>(req: AuthenticatedRequest<P>): AccessTokenPayload => {
  if (!req.auth) throw ApiError.unauthorized('Missing bearer token');
  return req.auth;
};
