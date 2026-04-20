import type { AccessTokenPayload } from '../utils/jwt/types';
import type { User } from '../modules/users/users.types';

declare global {
  namespace Express {
    interface Request {
      auth?: AccessTokenPayload;
      user?: User;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AccessTokenPayload;
    user?: User;
  }
}

export {};
