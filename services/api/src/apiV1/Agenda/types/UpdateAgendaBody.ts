import { z } from 'zod';

export const updateAgendaBodySchema = z.object({
  contentid: z.number().optional(),
  televisionid: z.number().optional(),
  fechaInicioAgenda: z.date().optional(),
  fechaFinAgenda: z.date().optional(),
  cron: z.string().optional(),
});

export type UpdateAgendaBodyType = z.infer<typeof updateAgendaBodySchema>;
