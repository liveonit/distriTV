import * as z from 'zod'

export const agendaSchema = z
  .object({
    id: z.number().optional(),
    destinationType: z.string(),
    contentId: z.number(),
    televisionId: z.number().optional().nullable(),
    labelId: z.number().optional().nullable(),
    startDate: z.date(),
    endDate: z.date(),
    cron: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.televisionId === undefined && value.destinationType === 'TELEVISION') {
      ctx.addIssue({
        message: 'Television must be specified',
        code: z.ZodIssueCode.custom,
        path: ['televisionId'],
      })
    }
    if (value.labelId === undefined && value.destinationType == 'LABEL') {
      ctx.addIssue({
        message: 'Label must be specified',
        code: z.ZodIssueCode.custom,
        path: ['labelId'],
      })
    }
  })

export type AgendaT = z.TypeOf<typeof agendaSchema>
