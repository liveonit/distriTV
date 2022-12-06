import { z } from 'zod';

export const updateInstitutionBodySchema = z.object({
  name: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
});

export type UpdateInstitutionBodyType = z.infer<typeof updateInstitutionBodySchema>;
