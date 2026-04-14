export type UserEntity = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

export type SessionEntity = {
  id: string;
  userId: string;
  refreshTokenHash: string;
  userAgent?: string;
  ip?: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
};
