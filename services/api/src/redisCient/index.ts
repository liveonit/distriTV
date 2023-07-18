import { createClient, RedisClientType } from 'redis';
import { config } from '@src/config';
let redisClient = {} as RedisClientType;
if (config.REDIS_ENABLED) {
  redisClient = createClient({
    socket: { host: config.REDIS_HOST, port: config.REDIS_PORT },
    password: config.REDIS_PASSWORD,
  });

  redisClient.on('error', (err) => {
    logger.error('Connection error: ' + err, 'REDIS');
  });
}
export { redisClient };
