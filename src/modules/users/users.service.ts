import { ApiError } from '../../utils/api-error';
import { PublicUserDto, toPublicUserDto } from './users.dto';
import { usersRepository } from './users.repository';
import { UserBlockInfo, UserStatuses } from './users.types';

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
};
