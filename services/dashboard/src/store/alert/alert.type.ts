import * as z from 'zod'

export const alertSchema = z
.object({
  id: z.number().optional(),
  televisionId: z.number().optional(),
  destinationType: z.string(),
  duration: z.number(),
  labelId: z.number().optional(),
  startDate: z.string().transform((a) => new Date(a)),
  text: z.string(),
  television: z.object({      
    name: z.string(),
  }).optional(),
  label: z.object({      
    name: z.string(),
  }).optional(),
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


export type AlertT = z.TypeOf<typeof alertSchema>
