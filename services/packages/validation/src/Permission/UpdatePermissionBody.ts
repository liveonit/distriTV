import { z } from 'zod';

export const updatePermissionBody = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type updatePermissionBodyType = z.infer<typeof updatePermissionBody>;
