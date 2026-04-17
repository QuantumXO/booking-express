import { User } from './users.types';

export type PublicUserDto = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export const toPublicUserDto = (user: User): PublicUserDto => ({
  id: user.id,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
