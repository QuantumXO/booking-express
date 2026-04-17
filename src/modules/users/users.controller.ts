import { Response } from 'express';
import { ApiError } from '../../utils/api-error';
import type { AuthenticatedRequest } from '../auth/auth.request.types';
import { usersService } from './users.service';
import { PublicUserDto } from './users.dto';

export const usersController = {
  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw ApiError.unauthorized('Missing bearer token');
    const user: PublicUserDto = await usersService.me(req.user.sub);
    res.status(200).json(user);
  },
  async blockUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  },
};
