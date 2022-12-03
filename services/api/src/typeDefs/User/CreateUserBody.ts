import { z } from 'zod';

export const roleMapping = z.object({
  roleId: z.string(),
  institutionId: z.number()
})

export const createUserBodySchema = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  enabled: z.boolean().default(true),
  email: z.string(),
  roleMappings: z.array(roleMapping),
});

export type CreateUserBodyType = z.infer<typeof createUserBodySchema>;
export type RoleMappingInput = z.infer<typeof roleMapping>
