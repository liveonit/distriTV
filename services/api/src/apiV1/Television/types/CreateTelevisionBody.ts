import { z } from 'zod';

export const createTelevisionBody = z.object({
  name: z.string(),
  city: z.string(),
  locality: z.string(),
});

export type CreateTelevisionBodyType = z.infer<typeof createTelevisionBody>;
