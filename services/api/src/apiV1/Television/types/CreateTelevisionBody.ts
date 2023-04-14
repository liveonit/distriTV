import { z } from 'zod';

export const createTelevisionBody = z.object({
  institutionId: z.number().optional(),
  ip: z.string(),
  mac: z.string(),
  tvCode: z.string().length(6),
  m2mRelations: z.object({
    label: z.array(z.number()).optional()
  }).optional(),
});

export type CreateTelevisionBodyType = z.infer<typeof createTelevisionBody>;
