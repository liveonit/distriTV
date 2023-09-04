import { z } from 'zod';

export const updateNotificationBodySchema = z.object({
  message: z.string(),
  title: z.string(),
});

export type UpdateNotificationBodyType = z.infer<typeof updateNotificationBodySchema>;
