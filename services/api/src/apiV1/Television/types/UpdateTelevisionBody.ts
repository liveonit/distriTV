import { z } from 'zod';

export const updateTelevisionBodySchema = z.object({
  ip: z.string(),
  mac: z.string(),
});

export type UpdateTelevisionBodyType = z.infer<typeof updateTelevisionBodySchema>;
