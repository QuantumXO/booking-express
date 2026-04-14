import { createApp } from './app';
import { Express } from 'express';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  try {
    const app: Express = createApp();

    app.listen(env.port, (): void => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (e) {
    console.error(e);
  }
}

void bootstrap();
