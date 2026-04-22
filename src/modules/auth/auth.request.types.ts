import type { Request } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import type { AccessTokenPayload } from '../../utils/jwt/types';
import type { User } from '../users/users.types';

export type AuthenticatedRequest<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = any,
  ReqQuery = Query,
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  auth?: AccessTokenPayload;
  user?: User;
};
