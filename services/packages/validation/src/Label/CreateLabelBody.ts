import { z } from 'zod';

export const createLabelBody = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type CreateLabelBodyType = z.infer<typeof createLabelBody>;
