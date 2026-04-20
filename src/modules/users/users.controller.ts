import { Response } from 'express';
import { getAuthUser } from '../auth/auth.helpers';
import type { AuthenticatedRequest } from '../auth/auth.request.types';
import { usersService } from './users.service';
import { PublicUserDto } from './users.dto';
import type { BlockUserDto } from './users.validation';

export const usersController = {
  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    const authUser = getAuthUser(req);
    const user: PublicUserDto = await usersService.me(authUser.sub);
    res.status(200).json(user);
  },
  async blockUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const authUser = getAuthUser(req);
    const body = req.body as BlockUserDto;
    const targetUserId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

    await usersService.blockUser(targetUserId, {
      blockedByUserId: authUser.sub,
      reason: body.reason ?? null,
    });

    res.status(204).send();
  },
  async unblockUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const targetUserId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    await usersService.unblockUser(targetUserId);
    res.status(204).send();
  },
};
