import { z } from 'zod';

export const createTelevisionBody = z.object({
  institutionId: z.number().optional(),
  ip: z.string(),
  mac: z.string(),
  m2mRelations: z.object({
    label: z.array(z.number()).optional(),
    notification: z.array(z.number()).optional(),
    content: z.array(z.number()).optional(),
  }).optional(),
});

export type CreateTelevisionBodyType = z.infer<typeof createTelevisionBody>;
