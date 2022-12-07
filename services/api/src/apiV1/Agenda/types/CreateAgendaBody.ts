import { z } from 'zod';

export const createAgendaBody = z.object({
  contentid: z.number(),
  televisionid: z.number(),
  fechaInicioAgenda: z.date(),
  fechaFinAgenda: z.date(),
  cron: z.string(),
  
});

export type CreateTelevisionBodyType = z.infer<typeof createAgendaBody>;
