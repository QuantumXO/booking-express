import type { Request } from 'express';
import type { AccessTokenPayload } from '../../utils/jwt/types';

export type AuthenticatedRequest = Request & {
  user?: AccessTokenPayload;
};
