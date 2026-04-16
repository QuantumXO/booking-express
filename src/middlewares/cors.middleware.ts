import cors, { CorsOptions } from 'cors';

const allowedOrigins = ['http://localhost'];
const corsOptions: CorsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS origin denied'));
  },
};

export const corsMiddleware = cors(corsOptions);
