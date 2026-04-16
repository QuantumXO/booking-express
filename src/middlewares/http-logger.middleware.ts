import pinoHttp, { HttpLogger } from 'pino-http';
import { logger } from '../utils/logger';

export const httpLogger: HttpLogger = pinoHttp({ logger });
