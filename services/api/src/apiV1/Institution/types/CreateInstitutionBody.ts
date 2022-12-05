import { z } from 'zod';

export const createInstitutionBody = z.object({
  username: z.string(),
  password: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  enabled: z.boolean().default(true),
  email: z.string(),
});

export type CreateInstitutionBodyType = z.infer<typeof createInstitutionBody>;
