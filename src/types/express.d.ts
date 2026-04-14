import type { AccessTokenPayload } from '../utils/jwt/types';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AccessTokenPayload;
  }
}

export {};
