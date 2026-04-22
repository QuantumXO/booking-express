import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

// $limit requests per $windowMs ms
export const rateLimitMiddleware: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
