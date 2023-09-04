import { z } from 'zod';

export const createPermissionBody = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type CreatePermissionBodyType = z.infer<typeof createPermissionBody>;
