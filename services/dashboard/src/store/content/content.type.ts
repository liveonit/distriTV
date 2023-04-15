import * as z from 'zod'

export const contentSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty('Name is required').min(2, 'Name must have at least 2 characters'),
  type: z.string().nonempty('Type is required'),
  url: z.string().optional(),
  text: z.string().optional(),
  duration: z.string().optional(),
})

export type ContentT = z.TypeOf<typeof contentSchema>