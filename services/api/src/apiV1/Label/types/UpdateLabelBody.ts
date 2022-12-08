import { z } from 'zod';

export const updateLabelBody = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export type UpdateLabelBodyType = z.infer<typeof updateLabelBody>;
