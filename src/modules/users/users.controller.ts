import { Response } from 'express';
import type { AuthenticatedRequest } from '../auth/auth.request.types';
import { usersService } from './users.service';
import { PublicUserDto, toPublicUserDto } from './users.dto';
import type { BlockUserDto } from './users.validation';
import { getUser } from './users.helpers';
import { User } from './users.types';

export const usersController = {
  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    const actor: User = getUser(req);
    const user: PublicUserDto = toPublicUserDto(actor);
    res.status(200).json(user);
  },
  async blockUser(req: AuthenticatedRequest<{ userId: string }, unknown, BlockUserDto>, res: Response): Promise<void> {
    const actor: User = getUser(req);
    const targetUserId: string = req.params.userId;

    await usersService.blockUser(targetUserId, {
      blockedByUserId: actor.id,
      reason: req.body.reason ?? null,
    });

    res.status(204).send();
  },
  async unblockUser(req: AuthenticatedRequest<{ userId: string }>, res: Response): Promise<void> {
    const targetUserId: string = req.params.userId;
    await usersService.unblockUser(targetUserId);
    res.status(204).send();
  },
  async deleteUser(req: AuthenticatedRequest<{ userId: string }>, res: Response): Promise<void> {
    const actor: User = getUser(req);
    const targetUserId: string = req.params.userId;
    await usersService.deleteUser(actor, targetUserId);
    res.status(204).send();
  },
};
