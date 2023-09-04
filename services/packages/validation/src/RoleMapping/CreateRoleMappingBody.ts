import { z } from 'zod';

export const createRoleMappingBody = z.object({
  roleId: z.string(),
  institutionId: z.string(),
  userId: z.string()
});

export type CreateRoleMappingBodyType = z.infer<typeof createRoleMappingBody>;
