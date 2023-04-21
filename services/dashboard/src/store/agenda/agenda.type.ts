import * as z from 'zod'

export const agendaSchema = z.object({
  id: z.number().optional(),
  contentId: z.number(),
  televisionId: z.number().optional(),
  labelId: z.number().optional(),
  startDate: z.date(),
  endDate: z.date(),
  cron: z.string(),
  type: z.string().optional(),
});

export type AgendaT = z.TypeOf<typeof agendaSchema>
