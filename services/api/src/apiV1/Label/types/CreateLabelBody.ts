import { z } from 'zod';

export const createLabelBody = z.object({
  name: z.string(),
  city: z.string(),
  locality: z.string(),
});

export type CreateLabelBodyType = z.infer<typeof createLabelBody>;
