import { z } from 'zod';

export const createScheduleBody = z.object({
  contentId: z.number(),
  televisionId: z.number().optional(),
  destinationType: z.string(),
  labelId: z.number().optional(),
  startDate: z.string().transform((a) => new Date(a)),
  endDate: z.string().transform((a) => new Date(a)),
  cron: z.string()
});

export type CreateTelevisionBodyType = z.infer<typeof createScheduleBody>;
