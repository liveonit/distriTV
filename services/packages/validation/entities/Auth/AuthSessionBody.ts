// import { TokenPayload } from 'google-auth-library';
import { z } from 'zod';

export const authPayloadSchema = z.object({
  id: z.string(),
  username: z.string(),
  enabled: z.boolean(),
  emailVerified: z.boolean(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  roleMappings: z.array(z.any()),
  sessionId: z.string().optional(),
});
export type AuthPayloadType = z.infer<typeof authPayloadSchema>;

export const authSessionSchema = z.object({
  id: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type AuthSessionType = z.infer<typeof authSessionSchema>;


export const mapFromGoogleToPayload = (googlePayload: any, roleMappings?: any[]) => {
  return {
    id: googlePayload.sub,
    username: googlePayload.email,
    email: googlePayload.email,
    firstName: googlePayload.given_name,
    lastName: googlePayload.family_name,
    emailVerified: googlePayload.email_verified,
    roleMappings
  } as AuthPayloadType
}
