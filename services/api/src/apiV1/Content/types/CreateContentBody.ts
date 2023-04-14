import { z } from 'zod';

export const createContentBody = z.object({
  name: z.string(),
  url: z.string().optional(),
  type: z.string(),
  text: z.string().optional(),
  duration: z.number().optional()
});

export type CreateContentBodyType = z.infer<typeof createContentBody>;
