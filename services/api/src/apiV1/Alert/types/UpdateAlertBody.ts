import { z } from 'zod';

export const updateAlertBody = z.object({
  id: z.number().optional(),
  televisionId: z.number().optional(),
  duration: z.number().optional(),
  destinationType: z.string().optional(),
  labelId: z.number().optional(),
  text: z.string().optional(),
});

export type UpdateAlertBodyType = z.infer<typeof updateAlertBody>;
