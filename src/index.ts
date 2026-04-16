import { createApp } from './app';
import { Express } from 'express';
import { env } from './config/env';
import { closeMongo, connectMongo } from './config/mongodb';
import { logger } from './utils/logger';

function logFatalAndExit(error: unknown, message: string): never {
  logger.fatal({ err: error }, message);
  process.exit(1);
}

process.on('uncaughtException', (error) => {
  logFatalAndExit(error, 'Uncaught exception');
});

process.on('unhandledRejection', (reason) => {
  logFatalAndExit(reason, 'Unhandled promise rejection');
});

async function bootstrap(): Promise<void> {
  try {
    await connectMongo();

    const app: Express = createApp();

    const server = app.listen(env.port, () => {
      logger.info(`Server running on http://localhost:${env.port}`);
    });

    const shutdown = async () => {
      logger.info('Shutdown signal received');
      server.close(async () => {
        await closeMongo();
        logger.info('HTTP server and MongoDB connection closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (e) {
    logFatalAndExit(e, 'Application bootstrap failed');
  }
}

void bootstrap();
