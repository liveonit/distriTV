import { Unauthorized } from '@src/utils/errors';
import { OAuth2Client } from 'google-auth-library';

class GoogleAuthService {
  public readonly client: OAuth2Client;
  constructor(clientId: string) {
    this.client = new OAuth2Client(clientId);
  }

  public async verify(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.client._clientId, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
      return payload;
    } catch (err) {
      logger.error(err);
      throw new Unauthorized('Error validating google token');
    }
  }
}
