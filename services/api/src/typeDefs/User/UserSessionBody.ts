import { RoleMapping } from '@src/entities/RoleMapping';
import { TokenPayload } from 'google-auth-library';
import { z } from 'zod';

export const userPayloadSchema = z.object({
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
export type UserPayloadType = z.infer<typeof userPayloadSchema>;

export const userSessionSchema = z.object({
  id: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type UserSessionType = z.infer<typeof userSessionSchema>;


export const mapFromGoogleToPayload = (googlePayload: TokenPayload, roleMappings?: RoleMapping[]) => {
  return {
    id: googlePayload.sub,
    username: googlePayload.email,
    email: googlePayload.email,
    firstName: googlePayload.given_name,
    lastName: googlePayload.family_name,
    emailVerified: googlePayload.email_verified,
    roleMappings
  } as UserPayloadType
}
