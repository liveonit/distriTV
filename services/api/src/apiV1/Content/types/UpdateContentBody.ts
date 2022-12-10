import { z } from 'zod';

export const updateContentBody = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
  type: z.string().optional()
});

export type UpdateContentBodyType = z.infer<typeof updateContentBody>;
