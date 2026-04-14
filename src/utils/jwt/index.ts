import jwt, { SignOptions } from 'jsonwebtoken';
import { AccessTokenPayload, RefreshTokenPayload } from './types';
import { env } from '../../config/env';

export const signAccessToken = (payload: AccessTokenPayload): string => {
  const options: SignOptions = {
    expiresIn: env.accessTokenTtl as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.jwtAccessSecret, options);
};

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  const options: SignOptions = {
    expiresIn: env.refreshTokenTtl as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.jwtRefreshSecret, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, env.jwtRefreshSecret) as RefreshTokenPayload;
};
