import { z } from 'zod';

export const updateScheduleBody = z.object({
  contentId: z.number(),
  destinationType: z.string(),
  televisionId: z.number().optional(),
  labelId: z.number().optional(),
  startDate: z.string().transform((a) => new Date(a)).optional(),
  endDate: z.string().transform((a) => new Date(a)).optional(),
  cron: z.string().optional(),
});

export type UpdateScheduleBodyType = z.infer<typeof updateScheduleBody>;
