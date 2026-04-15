import { createApp } from './app';
import { Express } from 'express';
import { env } from './config/env';
import { closeMongo, connectMongo } from './config/mongodb';

async function bootstrap(): Promise<void> {
  try {
    await connectMongo();

    const app: Express = createApp();

    const server = app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });

    const shutdown = async () => {
      server.close(async () => {
        await closeMongo();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

void bootstrap();
