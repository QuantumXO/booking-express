import type { AccessTokenPayload } from '../utils/jwt/types';
import type { User } from '../modules/users/users.types';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
      currentUser?: User;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AccessTokenPayload;
    currentUser?: User;
  }
}

export {};
