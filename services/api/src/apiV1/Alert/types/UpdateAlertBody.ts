import { z } from 'zod';

export const updateAlertBody = z.object({
  id: z.number().optional(),
  televisionId: z.number().optional(),
  duration: z.number().optional(),
  labelId: z.number().optional(),
  startDate: z.string().transform((a) => new Date(a)).optional(),
  text: z.string().optional(),
});

export type UpdateAlertBodyType = z.infer<typeof updateAlertBody>;
