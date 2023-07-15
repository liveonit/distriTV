import * as z from 'zod'

export const alertSchema = z
.object({
  id: z.number().optional(),
  destinationType: z.string(),
  duration: z.number(),
  labelId: z.number().optional(),
  text: z.string(),
  television: z.object({      
    id: z.number(),
    name: z.string().optional(),
  }).optional(),
  label: z.object({      
    name: z.string(),
  }).optional(),
})
.superRefine((value, ctx) => {
  if (value.television?.id === undefined && value.destinationType === 'TELEVISION') {
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
