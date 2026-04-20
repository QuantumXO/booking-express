import type { Request } from 'express';
import type { AccessTokenPayload } from '../../utils/jwt/types';
import type { User } from '../users/users.types';

export type AuthenticatedRequest = Request & {
  auth?: AccessTokenPayload;
  user?: User;
};
