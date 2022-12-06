import { z } from 'zod';

export const createTelevisionBody = z.object({
  institutionId: z.number().optional(),
  ip: z.string(),
  mac: z.string(),
 
});

export type CreateTelevisionBodyType = z.infer<typeof createTelevisionBody>;
