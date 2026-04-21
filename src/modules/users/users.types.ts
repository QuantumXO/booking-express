export type NewUser = {
  id: string;
  email: string;
  password: string;
  roles?: UserRoles[];
  status?: UserStatuses;
};

export enum UserRoles {
  CONTRACTOR = 'contractor',
  ADMIN = 'admin',
}

export enum UserStatuses {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

export type User = {
  id: string;
  email: string;
  password: string;
  roles: UserRoles[];
  status: UserStatuses;

  createdAt: Date;
  updatedAt: Date;

  blockedAt: Date | null;
  blockedReason: string | null;
  blockedByUserId: string | null;
};

export type UserBlockInfo = {
  blockedByUserId: string;
  reason: string | null;
};

export type UserBlockState = {
  status: UserStatuses;
  blockedAt: Date | null;
  blockedReason: string | null;
  blockedByUserId: string | null;
};
