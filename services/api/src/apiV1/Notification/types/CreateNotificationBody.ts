import { z } from 'zod';

export const createNotificationBody = z.object({
  message: z.string(),
  title: z.string(),
});

export type CreateNotificationBodyType = z.infer<typeof createNotificationBody>;
