import bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './auth.validation';
import { AuthSession } from './auth.types';
import { ApiError } from '../../utils/api-error';
import { generateTokenId, sha256 } from '../../utils/crypto';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { authRepository } from './auth.repository';
import { AccessTokenResponseDto, AuthResponseDto } from './auth.dto';
import { toPublicUserDto } from '../users/users.dto';
import { usersRepository } from '../users/users.repository';
import { NewUser, UserStatuses } from '../users/users.types';
import { JwtTokenTypes } from '../../utils/jwt/types';

const getRefreshExpiryDate = (): Date => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  return expiresAt;
};

export const authService = {
  async register(
    body: RegisterDto,
    meta?: { userAgent?: string; ip?: string },
  ): Promise<AuthResponseDto & { refreshToken: string }> {
    const existingUser = await usersRepository.findByEmail(body.email);

    if (existingUser) throw ApiError.conflict('User with this email already exists');

    const password = await bcrypt.hash(body.password, 12);

    const user: NewUser = {
      id: crypto.randomUUID(),
      email: body.email,
      password,
      status: UserStatuses.ACTIVE,
    };

    const createdUser = await usersRepository.create(user);

    const sessionId = generateTokenId();

    const refreshToken = signRefreshToken({
      sub: user.id,
      sid: sessionId,
      type: JwtTokenTypes.REFRESH,
    });

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      type: JwtTokenTypes.ACCESS,
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
      user: toPublicUserDto(createdUser),
      accessToken,
      refreshToken,
    };
  },

  async login(
    body: LoginDto,
    meta?: { userAgent?: string; ip?: string },
  ): Promise<AuthResponseDto & { refreshToken: string }> {
    const user = await usersRepository.findByEmail(body.email);

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (user.status !== UserStatuses.ACTIVE) {
      throw ApiError.forbidden('User is blocked');
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const sessionId = generateTokenId();

    const refreshToken = signRefreshToken({
      sub: user.id,
      sid: sessionId,
      type: JwtTokenTypes.REFRESH,
    });

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      type: JwtTokenTypes.ACCESS,
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
      user: toPublicUserDto(user),
      accessToken,
      refreshToken,
    };
  },

  async refresh(rawRefreshToken: string): Promise<AccessTokenResponseDto & { refreshToken: string }> {
    let payload: ReturnType<typeof verifyRefreshToken>;

    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    if (payload.type !== JwtTokenTypes.REFRESH) {
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

    const user = await usersRepository.findById(session.userId);

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (user.status !== UserStatuses.ACTIVE) {
      throw ApiError.forbidden('User is blocked');
    }

    const newRefreshToken = signRefreshToken({
      sub: user.id,
      sid: session.id,
      type: JwtTokenTypes.REFRESH,
    });

    const newAccessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      type: JwtTokenTypes.ACCESS,
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
};
