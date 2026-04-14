export const env = {
  port: Number(process.env.PORT ?? 3000),

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'access-secret-dev',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret-dev',

  accessTokenTtl: process.env.JWT_ACCESS_TTL ?? '15m',
  refreshTokenTtl: process.env.JWT_REFRESH_TTL ?? '30d',

  refreshCookieName: 'refreshToken',
};
