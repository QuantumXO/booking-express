import { Response } from 'express';
import { getAuth } from '../auth/auth.helpers';
import type { AuthenticatedRequest } from '../auth/auth.request.types';
import { usersService } from './users.service';
import { PublicUserDto } from './users.dto';
import type { BlockUserDto } from './users.validation';
import { getUser } from './users.helpers';
import { User } from './users.types';

export const usersController = {
  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    const auth = getAuth(req);
    const user: PublicUserDto = await usersService.me(auth.sub);
    res.status(200).json(user);
  },
  async blockUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const auth = getAuth(req);
    const body = req.body as BlockUserDto;
    const targetUserId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

    await usersService.blockUser(targetUserId, {
      blockedByUserId: auth.sub,
      reason: body.reason ?? null,
    });

    res.status(204).send();
  },
  async unblockUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const targetUserId: string = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    await usersService.unblockUser(targetUserId);
    res.status(204).send();
  },
  async deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const actor: User = getUser(req);
    const targetUserId: string = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    await usersService.deleteUser(actor, targetUserId);
    res.status(204).send();
  },
};
