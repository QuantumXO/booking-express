export type NewUser = {
  id: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  password: string;

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
  blockedAt: Date | null;
  blockedReason: string | null;
  blockedByUserId: string | null;
};
