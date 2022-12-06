import { z } from 'zod';

export const updateContentBodySchema = z.object({
  name: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
});

export type UpdateContentBodyType = z.infer<typeof updateContentBodySchema>;
