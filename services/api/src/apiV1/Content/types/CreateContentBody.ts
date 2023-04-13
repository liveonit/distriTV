import { z } from 'zod';

export const createContentBody = z.object({
  name: z.string(),
  url: z.string(),
  type: z.string(),
  text: z.string().optional()
});

export type CreateContentBodyType = z.infer<typeof createContentBody>;
