import * as z from 'zod'

export const agendaSchema = z.object({
  contentId: z.number(),
  televisionId: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  cron: z.string(),
});

export type AgendaT = z.TypeOf<typeof agendaSchema>
