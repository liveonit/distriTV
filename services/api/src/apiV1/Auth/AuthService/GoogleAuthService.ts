import { config } from '@src/config';
import { RoleMapping } from '@src/entities/RoleMapping';
import { User } from '@src/entities/User';
import { mapFromGoogleToPayload } from 'validation/src';
import { Unauthorized } from '@lib/errors';
import { OAuth2Client } from 'google-auth-library';

class GoogleAuthService {
  public readonly client: OAuth2Client;
  constructor(clientId: string) {
    this.client = new OAuth2Client(clientId);
  }

  public async login(tokenId: string) {
    console.log({ tokenId });
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: tokenId,
        audience: this.client._clientId,
      });
      const payload = ticket.getPayload();
      if (!payload) throw new Unauthorized('Error getting google payload');
      logger.debug({ payload });
      let user = await User.findOne({
        where: { id: payload.sub },
        relations: ['roleMappings', 'roleMappings.role', 'roleMappings.institution'],
      });
      logger.debug({ user });
      if (!user) {
        user = await User.create({
          ...mapFromGoogleToPayload(payload),
          loginType: 'google',
          enabled: true,
        }).save();
        const defaultRole = await RoleMapping.create({
          userId: user.id,
          roleId: '7b5ec802-5923-4a1b-b9d1-2f522ad6c6a3',
          institutionId: 1,
        }).save();
        user.roleMappings = [defaultRole];
      }
      const updatedUser = await User.findOne({
        where: { id: user.id },
        relations: ['roleMappings', 'roleMappings.role', 'roleMappings.institution'],
      });
      return updatedUser;
    } catch (err) {
      logger.debug(err);
      throw new Unauthorized('Error validating google token');
    }
  }

  public async verify(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.client._clientId,
      });
      const payload = ticket.getPayload();
      return payload;
    } catch (err) {
      logger.error(err);
      throw new Unauthorized('Error validating google token');
    }
  }
}

export const googleAuthSvc = new GoogleAuthService(config.GOOGLE_CLIENT_ID);
