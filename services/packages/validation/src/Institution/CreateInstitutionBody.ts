import { z } from 'zod';

export const createInstitutionBody = z.object({
  name: z.string(),
  city: z.string(),
  locality: z.string(),
  requiresApproval: z.boolean().default(false),
});

export type CreateInstitutionBodyType = z.infer<typeof createInstitutionBody>;
