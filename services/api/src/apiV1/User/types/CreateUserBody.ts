import { z } from 'zod';

export const roleMapping = z.object({
  roleId: z.string(),
  institutionId: z.number(),
});

export const createUserBody = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  enabled: z.boolean().default(true),
  email: z.string().email(),
  m2mRelations: z.array(
    z.object({
      roleMappings: z.array(z.object({ institutionId: z.number(), roleId: z.string() })),
    }),
  ),
});

export type CreateUserBodyType = z.infer<typeof createUserBody>;
export type RoleMappingInput = z.infer<typeof roleMapping>;
