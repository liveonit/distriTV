import { z } from 'zod';

export const updateScheduleBody = z.object({
  contentId: z.number(),
  televisionId: z.number(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  cron: z.string().optional(),
});

export type UpdateScheduleBodyType = z.infer<typeof updateScheduleBody>;
