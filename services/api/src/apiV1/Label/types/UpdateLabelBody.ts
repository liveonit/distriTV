import { z } from 'zod';

export const updateLabelBodySchema = z.object({
  name: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
});

export type UpdateLabelBodyType = z.infer<typeof updateLabelBodySchema>;
