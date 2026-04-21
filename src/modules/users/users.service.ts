import { ApiError } from '../../utils/api-error';
import { PublicUserDto, toPublicUserDto } from './users.dto';
import { usersRepository } from './users.repository';
import { User, UserBlockInfo, UserRoles, UserStatuses } from './users.types';
import { authRepository } from '../auth/auth.repository';

export const usersService = {
  async me(userId: string): Promise<PublicUserDto> {
    const user = await usersRepository.findById(userId);

    if (!user) throw ApiError.notFound('User not found');

    return toPublicUserDto(user);
  },
  async blockUser(userId: string, blockInfo: UserBlockInfo): Promise<void> {
    const user = await usersRepository.findById(userId);

    if (!user) throw ApiError.notFound('User not found');

    if (user.blockedAt) return;

    await usersRepository.updateBlockState(userId, {
      status: UserStatuses.BLOCKED,
      blockedAt: new Date(),
      blockedReason: blockInfo.reason,
      blockedByUserId: blockInfo.blockedByUserId,
    });
  },
  async unblockUser(userId: string): Promise<void> {
    const user = await usersRepository.findById(userId);

    if (!user) throw ApiError.notFound('User not found');

    if (!user.blockedAt) return;

    await usersRepository.updateBlockState(userId, {
      status: UserStatuses.ACTIVE,
      blockedAt: null,
      blockedReason: null,
      blockedByUserId: null,
    });
  },
  async deleteUser(actor: User, targetUserId: string): Promise<void> {
    const targetUser: User | null = await usersRepository.findById(targetUserId);
    if (!targetUser) throw ApiError.notFound('User not found');

    if (targetUser.roles.includes(UserRoles.ADMIN)) throw ApiError.forbidden("You can't delete admin");

    const isActorAdmin: boolean = actor.roles.includes(UserRoles.ADMIN);

    if (!isActorAdmin && actor.id !== targetUserId) throw ApiError.forbidden("You can't delete another user");

    await Promise.all([usersRepository.deleteUser(targetUserId), authRepository.revokeAllUserSessions(targetUserId)]);
  },
};
