import 'reflect-metadata';

import { App } from './App';

import { db } from './db';
import { config } from './config';

import { redisClient } from './redisCient';

import { logger } from '@lib/Logger';
global.logger = logger;

async function main() {
  // Detect unhandled exceptions
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(
      JSON.stringify({
        error: 'Unhandled promise rejection',
        promise,
        reason,
      }),
    );
  });

  // Initialize DB connection
  // Connect to db, run pending migrations and run seeds
  await db.connectDb({ retry: true, runAfterConnect: 'migrations' });

  // Connect Redis client cache
  config.REDIS_ENABLED && (await redisClient.connect());

  const app = new App();
  app.start();
}
if (require.main === module) {
  main();
}
