import * as z from 'zod'

export const agendaSchema = z.object({
  id: z.number().optional(),
  contentId: z.number(),
  televisionId: z.number().optional(),
  labelId: z.number().optional(),
  startDate: z.date(),
  endDate: z.date(),
  cron: z.string(),
  type: z.string(),
}).superRefine((value, ctx) => {
  if (value.televisionId == 0 && value.type === 'Televisión') {
    
    ctx.addIssue({
      message: 'Television must be specified',
      code: z.ZodIssueCode.custom,
      path: ["televisionId"],
    })
  }
    if (value.labelId == 0   && value.type == 'Etiqueta') {
      ctx.addIssue({
        message: 'Label must be specified',
        code: z.ZodIssueCode.custom,
        path: ["labelId"],
      })
    }
  })



export type AgendaT = z.TypeOf<typeof agendaSchema>
