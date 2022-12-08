import { z } from 'zod';

export const createRoleBody = z.object({
  name: z.string(),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).optional(),
});

export type CreateRoleBodyType = z.infer<typeof createRoleBody>;
