import { z } from 'zod';

export const updateRoleMappingBody = z.object({
  roleId: z.string().optional(),
  institutionId: z.string().optional(),
  userId: z.string().optional()
});

export type UpdateRoleMappingBodyType = z.infer<typeof updateRoleMappingBody>;
