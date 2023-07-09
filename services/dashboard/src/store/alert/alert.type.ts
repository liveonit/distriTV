import * as z from 'zod'

export const alertSchema = z
.object({
  id: z.number().optional(),
  destinationType: z.string(),
  contentId: z.number()
})

export type AlertT = z.TypeOf<typeof alertSchema>
