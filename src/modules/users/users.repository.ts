import { UserDocument, UserModel } from './users.models';
import { NewUser, UserBlockState, User } from './users.types';

const toUser = (user: UserDocument): User => ({
  id: user._id,
  email: user.email,
  password: user.password,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  blockedAt: user.blockedAt ?? null,
  blockedReason: user.blockedReason ?? null,
  blockedByUserId: user.blockedByUserId ?? null,
});

export const usersRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).lean();

    return user ? toUser(user) : null;
  },

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).lean();

    return user ? toUser(user) : null;
  },

  async findByIds(ids: string[]): Promise<User[]> {
    if (ids.length === 0) {
      return [];
    }

    const users = await UserModel.find({ _id: { $in: ids } }).lean();

    return users.map(toUser);
  },

  async create(user: NewUser): Promise<User> {
    await UserModel.create({
      _id: user.id,
      email: user.email,
      password: user.password,
    });

    const createdUser = await UserModel.findById(user.id).lean();

    if (!createdUser) throw new Error(`Failed to create user ${user.id}`);

    return toUser(createdUser);
  },

  async updateBlockState(userId: string, blockInfo: UserBlockState): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          blockedAt: blockInfo.blockedAt,
          blockedReason: blockInfo.blockedReason,
          blockedByUserId: blockInfo.blockedByUserId,
        },
      },
    );
  },
};
