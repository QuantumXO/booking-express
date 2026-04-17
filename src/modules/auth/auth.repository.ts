import { AuthSession } from './auth.types';
import { SessionDocument, SessionModel } from './auth.models';

const toAuthSession = (session: SessionDocument): AuthSession => ({
  id: session._id,
  userId: session.userId,
  refreshTokenHash: session.refreshTokenHash,
  userAgent: session.userAgent ?? undefined,
  ip: session.ip ?? undefined,
  expiresAt: session.expiresAt,
  createdAt: session.createdAt,
  revokedAt: session.revokedAt ?? null,
});

export const authRepository = {
  async createSession(session: AuthSession): Promise<AuthSession> {
    await SessionModel.create({
      _id: session.id,
      userId: session.userId,
      refreshTokenHash: session.refreshTokenHash,
      userAgent: session.userAgent,
      ip: session.ip,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      revokedAt: session.revokedAt,
    });

    return session;
  },

  async findSessionById(id: string): Promise<AuthSession | null> {
    const session = await SessionModel.findById(id).lean();

    return session ? toAuthSession(session) : null;
  },

  async revokeSession(id: string): Promise<void> {
    await SessionModel.updateOne({ _id: id }, { $set: { revokedAt: new Date() } });
  },

  async rotateSessionRefreshToken(id: string, refreshTokenHash: string, expiresAt: Date): Promise<void> {
    await SessionModel.updateOne(
      { _id: id },
      {
        $set: {
          refreshTokenHash,
          expiresAt,
        },
      },
    );
  },

  async revokeAllUserSessions(userId: string): Promise<void> {
    await SessionModel.updateMany(
      { userId, revokedAt: null },
      {
        $set: {
          revokedAt: new Date(),
        },
      },
    );
  },
};
