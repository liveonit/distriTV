import { z } from 'zod';

export const createContentBody = z.object({
  name: z.string(),
  url: z.string(),
  type: z.string()
});

export type CreateContentBodyType = z.infer<typeof createContentBody>;
