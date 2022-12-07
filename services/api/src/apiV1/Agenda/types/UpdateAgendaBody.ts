import { z } from 'zod';

export const updateAgendaBodySchema = z.object({
  institutionId: z.number().optional(),
  ip: z.string().optional(),
  mac: z.string().optional(),
});

export type UpdateAgendaBodyType = z.infer<typeof updateAgendaBodySchema>;
