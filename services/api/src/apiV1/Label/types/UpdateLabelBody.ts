import { z } from 'zod';

export const updateLabelBodySchema = z.object({
  description: z.string(),
});

export type UpdateLabelBodyType = z.infer<typeof updateLabelBodySchema>;
