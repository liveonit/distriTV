import { z } from 'zod';

const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
});

const roleMappingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  roleId: z.string(),
  institutionId: z.number(),
  role: roleSchema.optional(),
});

export const userResponseBody = z.object({
  id: z.string(),
  username: z.string(),
  loginType: z.enum(['local', 'google']),
  enabled: z.boolean(),
  emailVerified: z.boolean(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  roleMappings: z.array(roleMappingSchema).optional(),
});

export type UserResponseBodyType = z.infer<typeof userResponseBody>;
