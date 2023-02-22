import { z } from 'zod';

export const updateTelevisionBodySchema = z.object({
  institutionId: z.number().optional(),
  ip: z.string().optional(),
  mac: z.string().optional(),
});

export type UpdateTelevisionBodyType = z.infer<typeof updateTelevisionBodySchema>;
