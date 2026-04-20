import { User, UserRoles } from './users.types';

export type PublicUserDto = {
  id: string;
  email: string;
  roles: UserRoles[];
  createdAt: Date;
  updatedAt: Date | null;
};

export const toPublicUserDto = (user: User): PublicUserDto => ({
  id: user.id,
  email: user.email,
  roles: user.roles,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
