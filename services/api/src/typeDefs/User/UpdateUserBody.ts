import { z } from 'zod';
import { roleMapping } from './CreateUserBody';

export const updateUserBodySchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  enabled: z.boolean().optional(),
  email: z.string().optional(),
  roleMappings: z.array(roleMapping),
});

export type UpdateUserBodyType = z.infer<typeof updateUserBodySchema>;
