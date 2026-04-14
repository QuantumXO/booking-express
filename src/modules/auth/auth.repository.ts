import { SessionEntity, UserEntity } from './auth.entities';

const users = new Map<string, UserEntity>();
const sessions = new Map<string, SessionEntity>();

export const authRepository = {
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    for (const user of users.values()) {
      if (user.email === email) return user;
    }
    return null;
  },

  async findUserById(id: string): Promise<UserEntity | null> {
    return users.get(id) ?? null;
  },

  async createUser(user: UserEntity): Promise<UserEntity> {
    users.set(user.id, user);
    return user;
  },

  async createSession(session: SessionEntity): Promise<SessionEntity> {
    sessions.set(session.id, session);
    return session;
  },

  async findSessionById(id: string): Promise<SessionEntity | null> {
    return sessions.get(id) ?? null;
  },

  async revokeSession(id: string): Promise<void> {
    const session = sessions.get(id);
    if (!session) return;
    session.revokedAt = new Date();
    sessions.set(id, session);
  },

  async rotateSessionRefreshToken(id: string, refreshTokenHash: string, expiresAt: Date): Promise<void> {
    const session = sessions.get(id);
    if (!session) return;

    session.refreshTokenHash = refreshTokenHash;
    session.expiresAt = expiresAt;
    sessions.set(id, session);
  },

  async revokeAllUserSessions(userId: string): Promise<void> {
    for (const session of sessions.values()) {
      if (session.userId === userId && !session.revokedAt) {
        session.revokedAt = new Date();
        sessions.set(session.id, session);
      }
    }
  },
};
