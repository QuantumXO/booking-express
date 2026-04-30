import { ApiError } from '../../utils/api-error';
import { AuthenticatedRequest } from '../auth/auth.request.types';
import { User, UserRoles } from './users.types';

export const getUser = <P>(req: AuthenticatedRequest<P>): User => {
  if (!req.user) throw ApiError.unauthorized('User not found');
  return req.user;
};

export const hasRole = (user: User, role: UserRoles): boolean => user.roles.includes(role);
export const isAdmin = (user: User): boolean => hasRole(user, UserRoles.ADMIN);
export const isContractor = (user: User): boolean => hasRole(user, UserRoles.CONTRACTOR);
