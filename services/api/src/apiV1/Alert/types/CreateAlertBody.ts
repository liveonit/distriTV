import { z } from 'zod';

export const createAlertBody = z.object({
  television: z.object({
    id: z.number()
  }),
  destinationType: z.string(),
  duration: z.number(),
  labelId: z.number().optional(),
  text: z.string(),
});

export type CreateTelevisionBodyType = z.infer<typeof createAlertBody>;

