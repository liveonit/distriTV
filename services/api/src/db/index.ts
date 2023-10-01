import { Db } from 'lib/BaseClasses/Db'

import { config } from '../config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import path from 'path';

const dbConfig: MysqlConnectionOptions = {
      type: 'mysql',
      host: config.DB_HOST,
      port: config.DB_PORT,
      username: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
      synchronize: false,
      logging: config.ENVIRONMENT !== 'production' ? ['error', 'query', 'schema'] : ['error'],
      entities: [path.resolve(__dirname, '../entities/**/*{.js,.ts}')],
      migrations: [
        path.resolve(__dirname, 'migrations/**/*{.js,.ts}'),
        path.resolve(__dirname, 'seeds/**/*{.js,.ts}'),
      ],
    }

export const db = new Db(dbConfig);
