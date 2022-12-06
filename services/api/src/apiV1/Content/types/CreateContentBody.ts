import { z } from 'zod';

export const createContentBody = z.object({
  name: z.string(),
  city: z.string(),
  locality: z.string(),
});

export type CreateContentBodyType = z.infer<typeof createContentBody>;
