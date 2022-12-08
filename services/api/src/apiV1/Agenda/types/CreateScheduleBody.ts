import { z } from 'zod';

export const createScheduleBody = z.object({
  contentId: z.number(),
  televisionId: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  cron: z.string(),
});

export type CreateTelevisionBodyType = z.infer<typeof createScheduleBody>;
