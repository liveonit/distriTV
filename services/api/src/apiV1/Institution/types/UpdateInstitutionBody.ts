import { z } from 'zod';

export const updateInstitutionBodySchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  enabled: z.boolean().optional(),
  email: z.string().optional(),
});

export type UpdateInstitutionBodyType = z.infer<typeof updateInstitutionBodySchema>;
