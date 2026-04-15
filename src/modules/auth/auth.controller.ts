import { Request, Response } from 'express';
import { env } from '../../config/env';
import { authService } from './auth.service';
import { ApiError } from '../../utils/api-error';
import type { AuthenticatedRequest } from './auth.request-types';

const refreshCookieOptions = {
  httpOnly: true,
  secure: false, // в prod -> true
  sameSite: 'lax' as const,
  path: '/auth/refresh',
};

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const result = await authService.register(req.body, {
      userAgent: req.get('user-agent'),
      ip: req.ip,
    });

    res.cookie(env.refreshCookieName, result.refreshToken, refreshCookieOptions);

    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  },

  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body, {
      userAgent: req.get('user-agent'),
      ip: req.ip,
    });

    res.cookie(env.refreshCookieName, result.refreshToken, refreshCookieOptions);

    res.status(200).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.[env.refreshCookieName];

    if (!refreshToken) {
      res.status(401).json({ message: 'Missing refresh token' });
      return;
    }

    const result = await authService.refresh(refreshToken);

    res.cookie(env.refreshCookieName, result.refreshToken, refreshCookieOptions);

    res.status(200).json({
      accessToken: result.accessToken,
    });
  },

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.[env.refreshCookieName];

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie(env.refreshCookieName, {
      path: '/auth/refresh',
    });

    res.status(204).send();
  },

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw ApiError.unauthorized('Missing bearer token');
    }

    const user = await authService.me(req.user.sub);
    res.status(200).json(user);
  },
};
