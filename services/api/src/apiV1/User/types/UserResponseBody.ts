import { z } from 'zod';

export const userResponseBody = z.object({
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  enabled: z.boolean().optional(),
  email: z.string().optional(),
  m2mRelations: z.array(z.object({
    roleMappings: z.array(z.object({ institutionId: z.number(), roleId: z.string()})),
  })).optional()
});

export type UserResponseBodyType = z.infer<typeof userResponseBody>;
