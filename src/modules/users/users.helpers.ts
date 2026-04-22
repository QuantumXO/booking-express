import { ApiError } from '../../utils/api-error';
import { AuthenticatedRequest } from '../auth/auth.request.types';
import { User } from './users.types';

export const getUser = <P>(req: AuthenticatedRequest<P>): User => {
  if (!req.user) throw ApiError.unauthorized('User not found');
  return req.user;
};
