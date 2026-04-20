export type AuthSession = {
  id: string;
  userId: string;
  refreshTokenHash: string;
  userAgent?: string;
  ip?: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
};
