import { z } from 'zod';

export const updateProfileBody = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  enabled: z.boolean().optional(),
  email: z.string().optional()
});

export type UpdateProfileBodyType = z.infer<typeof updateProfileBody>;
