import bcrypt from 'bcrypt';
import { LoginBody, RegisterBody } from './auth.schemas';
import { AuthSession, AuthUser } from './auth.types';
import { ApiError } from '../../utils/api-error';
import { generateTokenId, sha256 } from '../../utils/crypto';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { authRepository } from './auth.repository';
import { AuthResponse, PublicUser } from './auth.contracts';

const toPublicUser = (user: AuthUser): PublicUser => ({
  id: user.id,
  email: user.email,
});

const getRefreshExpiryDate = (): Date => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  return expiresAt;
};

export const authService = {
  async register(
    body: RegisterBody,
    meta?: { userAgent?: string; ip?: string },
  ): Promise<AuthResponse & { refreshToken: string }> {
    const existingUser = await authRepository.findUserByEmail(body.email);

    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    const password = await bcrypt.hash(body.password, 12);

    const user: AuthUser = {
      id: crypto.randomUUID(),
      email: body.email,
      password,
      createdAt: new Date(),
    };

    await authRepository.createUser(user);

    const sessionId = generateTokenId();

    const refreshToken = signRefreshToken({
      sub: user.id,
      sid: sessionId,
      type: 'refresh',
    });

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      type: 'access',
    });

    const session: AuthSession = {
      id: sessionId,
      userId: user.id,
      refreshTokenHash: sha256(refreshToken),
      userAgent: meta?.userAgent,
      ip: meta?.ip,
      expiresAt: getRefreshExpiryDate(),
      createdAt: new Date(),
      revokedAt: null,
    };

    await authRepository.createSession(session);

    return {
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    };
  },

  async login(
    body: LoginBody,
    meta?: { userAgent?: string; ip?: string },
  ): Promise<AuthResponse & { refreshToken: string }> {
    const user = await authRepository.findUserByEmail(body.email);

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const sessionId = generateTokenId();

    const refreshToken = signRefreshToken({
      sub: user.id,
      sid: sessionId,
      type: 'refresh',
    });

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      type: 'access',
    });

    const session: AuthSession = {
      id: sessionId,
      userId: user.id,
      refreshTokenHash: sha256(refreshToken),
      userAgent: meta?.userAgent,
      ip: meta?.ip,
      expiresAt: getRefreshExpiryDate(),
      createdAt: new Date(),
      revokedAt: null,
    };

    await authRepository.createSession(session);

    return {
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    };
  },

  async refresh(rawRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: ReturnType<typeof verifyRefreshToken>;

    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw ApiError.unauthorized('Invalid token type');
    }

    const session = await authRepository.findSessionById(payload.sid);

    if (!session || session.revokedAt) {
      throw ApiError.unauthorized('Session not found or revoked');
    }

    if (session.expiresAt.getTime() < Date.now()) {
      throw ApiError.unauthorized('Refresh session expired');
    }

    const incomingHash = sha256(rawRefreshToken);

    if (session.refreshTokenHash !== incomingHash) {
      await authRepository.revokeSession(session.id);
      throw ApiError.unauthorized('Refresh token replay detected');
    }

    const user = await authRepository.findUserById(session.userId);

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    const newRefreshToken = signRefreshToken({
      sub: user.id,
      sid: session.id,
      type: 'refresh',
    });

    const newAccessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      type: 'access',
    });

    await authRepository.rotateSessionRefreshToken(session.id, sha256(newRefreshToken), getRefreshExpiryDate());

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  async logout(rawRefreshToken: string): Promise<void> {
    let payload: ReturnType<typeof verifyRefreshToken>;

    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      return;
    }

    await authRepository.revokeSession(payload.sid);
  },

  async me(userId: string): Promise<PublicUser> {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return toPublicUser(user);
  },
};
