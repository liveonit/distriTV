import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { googleLoginBodySchema, loginBodySchema, refreshTokenBodySchema } from '.';
import { Request, Response } from 'express';

import _ from 'lodash';
import { BadRequest, Unauthorized } from '@lib/errors';
import { authSvc } from '@src/apiV1/Auth/AuthService';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { googleAuthSvc } from '@src/apiV1/Auth/AuthService/GoogleAuthService';
import { User } from '@src/entities/User';
import { updateProfileBody, UpdateProfileBodyType } from './types/UpdateProfileBody';
import { redisClient } from '@src/redisCient';
import { config } from '@src/config';
import argon2 from 'argon2';

class AuthController {
  /*
   * Devuelve el perfil del usuario logueado
   */
  public getProfile = handleErrorAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) throw new Unauthorized('Invalid credentials');
    const { id } = req.user;
    const user = await authSvc.getOne({ id });
    return res.status(200).json(user);
  });

  public async updateUser(
    id: string,
    user: UpdateProfileBodyType,
    sessionId?: string,
  ): Promise<Omit<User, 'password'>> {
    let currentUser = await User.findOneOrFail({
      where: { id },
      relations: ['roleMappings', 'roleMappings.role', 'roleMappings.institution'],
    });
    if (user.password) {
      currentUser.password = await argon2.hash(user.password);
      config.REDIS_ENABLED && (await redisClient.del(`${id}:*`));
    }
    currentUser = await currentUser.save();

    if (sessionId)
      config.REDIS_ENABLED &&
        redisClient.set(
          `${currentUser.id}:${sessionId}`,
          JSON.stringify({ ..._.omit(currentUser, ['password']), sessionId }),
          {
            EX: config.REFRESH_TOKEN_EXPIRES_IN * 60,
          },
        );
    return _.omit(currentUser, ['password']);
  }

  /*
   * Actualiza el perfil del usuario logueado
   */
  public updateProfile = handleErrorAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) throw new Unauthorized('Invalid credentials');
    const { id, sessionId } = req.user;
    const user = updateProfileBody.parse(req.body);
    const updatedUser = await authSvc.updateUser(id, user, sessionId);
    return res.status(200).json(updatedUser);
  });

  /*
   * Authorize local user
   */
  public localLogin = handleErrorAsync(async (req: Request, res: Response) => {
    const loginData = loginBodySchema.parse(req.body);
    const result = await authSvc.login(loginData);
    return res.status(200).json(result);
  });

  /*
   * Authorize google user
   */
  public googleLogin = handleErrorAsync(async (req: Request, res: Response) => {
    const loginData = googleLoginBodySchema.parse(req.body);
    const result = await googleAuthSvc.login(loginData.tokenId);
    return res.status(200).json(result);
  });

  /*
   * Finish user session
   */
  public logout = handleErrorAsync(async (req: Request, res: Response) => {
    if (!req.user?.id || !req.user?.sessionId) throw new Unauthorized('Invalid credentials');
    const { id, sessionId } = req.user;
    await authSvc.logout(id, sessionId);
    return res.status(200).send();
  });

  /*
   * Refresh Access token
   */
  public refreshToken = handleErrorAsync(async (req: Request, res: Response) => {
    const body = refreshTokenBodySchema.parse(req.body);
    const result = await authSvc.refreshToken(body);
    return res.status(200).json(result);
  });
}

export const userController = new AuthController();
