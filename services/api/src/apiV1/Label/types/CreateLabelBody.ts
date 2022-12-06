import { z } from 'zod';

export const createLabelBody = z.object({
  description: z.string(),
  
});

export type CreateLabelBodyType = z.infer<typeof createLabelBody>;
