import { db } from './db';
import { redisClient } from './redisCient';
import express, { Request, Response, NextFunction, urlencoded } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { errorCatcher } from '@middlewares/errorCatcher';
import { loggerMiddleware } from '@middlewares/logger.middleware';
import router from './apiV1';
import audit from 'express-requests-logger';
import { config } from './config';
import { NotFound } from '@lib/errors';
import fileUpload from 'express-fileupload';

export class App {
  public readonly app = express();
  constructor() {
    this.setMiddlewares();
    this.setRoutes();
    this.app.use(this.notFoundError);
    this.app.use(errorCatcher);
  }

  private setMiddlewares = (): void => {
    this.app.use(urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(
      audit({
        logger: logger, // Existing bunyan logger
        excludeURLs: ['health', 'metrics'], // Exclude paths which enclude 'health' & 'metrics'
        request: {
          maskBody: ['password'], // Mask 'password' field in incoming requests
          excludeHeaders: ['authorization'], // Exclude 'authorization' header from requests
          excludeBody: ['creditCard'], // Exclude 'creditCard' field from requests body
          maskHeaders: ['header1'], // Mask 'header1' header in incoming requests
          maxBodyLength: 50, // limit length to 50 chars + '...'
        },
        response: {
          maskBody: ['session_token'], // Mask 'session_token' field in response body
          excludeHeaders: ['*'], // Exclude all headers from responses,
          excludeBody: ['*'], // Exclude all body from responses
          maskHeaders: [], // Mask 'header1' header in incoming requests
          maxBodyLength: 50, // limit length to 50 chars + '...'
        },
      }),
    );

    this.app.use(
      fileUpload({
        ...(config.STORAGE_TYPE === 'local' && {
          tempFileDir: '/tmp/',
          useTempFiles: true,
        }),
        uploadTimeout: 0, //disabled
        debug: true,
        limits: { fileSize: 100 * 1024 * 1024 },
      }),
    );
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(loggerMiddleware);
  };
  private setRoutes = (): void => {
    this.app.get(`${config.API_PREFIX}/${config.API_VERSION}/health`, this.healthCheck);
    if (config.ENVIRONMENT === 'development')
      this.app.get(
        `${config.API_PREFIX}/${config.API_VERSION}/clear-db`,
        this.clearDbEndpointForDev,
      );
    this.app.use(`${config.API_PREFIX}/${config.API_VERSION}`, router);
  };

  private notFoundError = (_req: Request, _res: Response, _next: NextFunction) => {
    throw new NotFound();
  };

  private clearDbEndpointForDev = async (_req: Request, res: Response, _next: NextFunction) => {
    await db.clearDb();
    return res.status(200).send();
  };

  private healthCheck = async (req: Request, res: Response, next: NextFunction) => {
    const dbStatus = (await db.getConnection().isInitialized) ? 'Connected' : 'Disconnected';
    const dbMigrations = (await db.getConnection().showMigrations())
      ? 'There are pending migrations'
      : "There aren't pending migrations";
    const redisStatus = config.REDIS_ENABLED
      ? (await redisClient.ping()) === 'PONG'
        ? 'Connected'
        : 'Disconnected'
      : 'disabled';
    return res.status(200).json({
      dbStatus,
      dbMigrations,
      redisStatus,
    });
  };

  public start = (): void => {
    this.app.listen(config.API_PORT, () => {
      logger.info(`Server is listening on ${config.ENVIRONMENT}`);
      logger.info(`Environment ${config.ENVIRONMENT}`);
    });
  };
}
