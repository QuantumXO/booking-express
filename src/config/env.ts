import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 3000),
  mongodbUri: process.env.MONGODB_URI ?? '',
  mongodbDbName: process.env.MONGODB_DB_NAME ?? 'booking_express',
  httpLogsEnabled: process.env.HTTP_LOGS_ENABLED === 'true',
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL ?? '',
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD ?? '',

  // JWT
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'access-secret-dev',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret-dev',
  accessTokenTtl: process.env.JWT_ACCESS_TTL ?? '15m',
  refreshTokenTtl: process.env.JWT_REFRESH_TTL ?? '30d',
  refreshCookieName: 'refreshToken',
};
