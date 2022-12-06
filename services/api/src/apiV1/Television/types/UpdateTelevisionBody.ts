import { z } from 'zod';

export const updateTelevisionBodySchema = z.object({
  name: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
});

export type UpdateTelevisionBodyType = z.infer<typeof updateTelevisionBodySchema>;
