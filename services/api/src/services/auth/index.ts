import { config } from '@src/config';
import { User } from '@src/entities/User';
import * as argon2 from 'argon2';

import { Role } from '@src/entities/Role';
import { FindManyOptions, In } from 'typeorm';

import { signJwt, verifyJwt } from './jwt';
import {
  UserSessionType,
  UserPayloadType,
  userPayloadSchema,
  userSessionSchema,
  mapFromGoogleToPayload,
} from '@typeDefs/User';
import _ from 'lodash';
import { redisClient } from '@src/redisCient';
import { CreateUserBodyType, RefreshTokenBodyType, UpdateUserBodyType } from '@src/typeDefs/User';
import { LoginBodyType } from '@src/typeDefs/User/LoginBody';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { BadRequest, Forbidden, NotFound, Unauthorized } from '@src/utils/errors';
import { handleErrorAsync } from '@middlewares/errorCatcher';
import { uuid } from '@src/utils/helpers/uuid';
import { RoleMapping } from '@src/entities/RoleMapping';
import { db } from '@src/db';
import { googleAuthSvc } from '../GoogleAuthService';
import { TokenPayload } from 'google-auth-library';
export interface CustomContext {
  req: Request;
  res: Response;
}

declare global {
  namespace Express {
    interface Request {
      user: UserPayloadType;
    }
  }
}

class AuthService {
  public async createUser(user: CreateUserBodyType): Promise<Omit<User, 'password'>> {
    let newUser = User.create(_.omit(user, ['roleMappings']) as User);
    newUser.password = await argon2.hash(user.password);
    newUser = await newUser.save();
    if (user.roleMappings) {
      newUser.roleMappings = user.roleMappings.map((rm) =>
        RoleMapping.create({ userId: newUser.id, ...rm }),
      );
    }
    return _.omit(newUser, ['password']);
  }

  public async updateUser(
    id: string,
    user: UpdateUserBodyType,
    sessionId?: string,
  ): Promise<Omit<User, 'password'>> {
    let currentUser = await User.findOneOrFail({
      where: { id },
      relations: ['roleMappings', 'roleMappings.role', 'roleMappings.institution'],
    });
    if (user.password) {
      currentUser.password = await argon2.hash(user.password);
      await redisClient.del(`${id}:*`);
    }
    currentUser = await currentUser.save();
    if (user.roleMappings) {
      db.getConnection().manager.transaction(async (tm) => {
        await tm.delete(RoleMapping, { userId: currentUser.id });
        await tm.insert(
          RoleMapping,
          user.roleMappings.map((rm) => ({ userId: currentUser.id, ...rm })),
        );
      });
      currentUser.roleMappings = await RoleMapping.find({
        where: { userId: currentUser.id },
        relations: ['roleMappings', 'roleMappings.role', 'roleMappings.institution'],
      });
    }

    if (sessionId)
      redisClient.set(
        `${currentUser.id}:${sessionId}`,
        JSON.stringify({..._.omit(currentUser, ['password']), sessionId }),
        {
          EX: config.REFRESH_TOKEN_EXPIRES_IN * 60,
        },
      );
    return _.omit(currentUser, ['password']);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await User.delete({ id });
    await redisClient.del(`${id}:*`);
    if (!result.affected) throw new NotFound();
    return !!result.affected;
  }

  public async getAll(options?: FindManyOptions<User>): Promise<User[]> {
    const result = await User.find({
      relations: ['roleMappings', 'roleMappings.role', 'roleMappings.institution'],
      ...options,
    });
    return result.map((r) => _.omit(r, ['password']));
  }

  public async getOne({ id, username }: { id?: string; username?: string }): Promise<User> {
    const result = await User.findOneOrFail({
      where: { id, username },
      relations: ['roleMappings', 'roleMappings.role', 'roleMappings.institution'],
    });
    return _.omit(result, ['password']);
  }

  public signToken = async (user: _.Omit<User, 'password'>) => {
    const sessionId = uuid();
    // Sign the access token
    const accessToken = signJwt({ ...user, sessionId }, 'ACCESS_TOKEN_PRIVATE_KEY', {
      expiresIn: `${config.ACCESS_TOKEN_EXPIRES_IN}m`,
    });

    // Sign the refresh token
    const refreshToken = signJwt({ ...user, sessionId }, 'REFRESH_TOKEN_PRIVATE_KEY', {
      expiresIn: `${config.REFRESH_TOKEN_EXPIRES_IN}m`,
    });

    // Create a Session
    redisClient.set(`${user.id}:${sessionId}`, JSON.stringify({...user, sessionId }), {
      EX: config.REFRESH_TOKEN_EXPIRES_IN * 60,
    });
    const result = userSessionSchema.parse({ id: user.id, accessToken, refreshToken });
    // Return access token
    return result;
  };

  public async login(data: LoginBodyType): Promise<UserSessionType> {
    const { username, password } = data;
    const user = await User.findOne({
      where: { username: username },
      relations: ['roleMappings', 'roleMappings.role', 'roleMappings.institution'],
    });
    if (user) {
      const correctPassword = await argon2.verify(user.password!, password);
      if (!correctPassword) {
        throw new Unauthorized();
      }
    } else {
      throw new Unauthorized();
    }
    const signedToken = await this.signToken(_.omit(user, ['password']));
    const result = userSessionSchema.parse(signedToken);
    return result;
  }

  public async logout(id: string, sessionId: string): Promise<void> {
    await redisClient.del(`${id}:${sessionId}`);
  }

  public async refreshToken(refreshTokenInput: RefreshTokenBodyType): Promise<UserSessionType> {
    try {
      // Validate the Refresh token
      const decoded = verifyJwt<UserPayloadType>(
        refreshTokenInput.refreshToken,
        'REFRESH_TOKEN_PUBLIC_KEY',
      );
      if (!decoded) {
        throw new BadRequest('Could not refresh access token');
      }

      // Check if the user has a valid session
      const session = await redisClient.get(`${decoded.id}:${decoded.sessionId}`);
      if (!session) {
        throw new BadRequest('Could not refresh access token');
      }
      const userPayload = JSON.parse(session);

      // Sign new access token
      const accessToken = signJwt(
        { ...userPayload, sessionId: decoded.sessionId },
        'ACCESS_TOKEN_PRIVATE_KEY',
        {
          expiresIn: `${config.ACCESS_TOKEN_EXPIRES_IN}m`,
        },
      );

      // Send the access token as cookie
      const result = userSessionSchema.parse({
        ...refreshTokenInput,
        accessToken,
        id: userPayload.id,
      });
      return result;
    } catch (err: any) {
      logger.error('Error refreshing access token: ' + err, 'AUTH');
      throw new BadRequest('Could not refresh access token');
    }
  }

  private getTokenFromHeader(req: Request) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }

  /**
   * @param {string[]} requiredPermissionsName - A list of permissions that the user needs to have to pass through this middleware,
   * if the list is empty the only requirement is that the user has to be authenticated
   *
   * @returns {Promise<import('express').RequestHandler>} An express.RequestHandler so its could be used in the express `app` or `router` methods
   *
   * @example
   * // It should be used in an express router function, for example
   *
   * // Only auth required
   * router.get('/', authSvc.authRequiredMiddleware([]), authorController.getMany);
   *
   * // EditAuthors permission required
   * router.post('/', authSvc.authRequiredMiddleware(['editAuthors']), authorController.create);
   *
   * //  Or to require authorization throughout the App, add this before setting the app's routers
   * app.use('/', authSvc.authRequiredMiddleware([]));
   *
   */
  public authRequiredMiddleware(requiredRoleNames: string[]): RequestHandler {
    return handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
      let userPayload;
      const authorizationType = req.headers['auth-type'];
      if (authorizationType === 'local') {
        const token = this.getTokenFromHeader(req);
        if (token == null) throw new Forbidden();
        const decoded: UserPayloadType | null = userPayloadSchema.parse(
          verifyJwt(token, 'ACCESS_TOKEN_PUBLIC_KEY'),
        );
        const session = await redisClient.get(`${decoded.id}:${decoded.sessionId}`);
        if (!decoded || !session) throw new Forbidden();
        userPayload = JSON.parse(session) as UserPayloadType;
      }

      if (authorizationType === 'google') {
        const token = req.headers.authorization?.toString();
        if (!token) throw new Unauthorized('Invalid credentials');
        const user = await googleAuthSvc.verify(token);
        if (!user) throw new Unauthorized('Invalid credentials');
        const localUser = await User.findOneOrFail({
          where: { id: user.sub },
          relations: ['roleMappings', 'roleMappings.role', 'roleMappings.institution'],
        });
        userPayload = mapFromGoogleToPayload(user, localUser.roleMappings);
      }
      if (userPayload) {
        if (requiredRoleNames && requiredRoleNames.length) {
          const userRoles = userPayload.roleMappings.map((r) => r.role.name);
          const hasRole = requiredRoleNames.reduce(
            (prev, current) => prev || userRoles.includes(current),
            false,
          );
          if (!hasRole) throw new Unauthorized('Invalid permissions');
        }
        req.user = userPayload;
        return next();
      } else throw new Unauthorized('Invalid authorization provider');
    });
  }
}

export const authSvc = new AuthService();
