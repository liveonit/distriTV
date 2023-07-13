import { z } from 'zod';

export const createAlertBody = z.object({
  id: z.number(),
  televisionId: z.number().optional(),
  duration: z.number(),
  labelId: z.number().optional(),
  startDate: z.string().transform((a) => new Date(a)),
  text: z.string(),
});

export type CreateTelevisionBodyType = z.infer<typeof createAlertBody>;

