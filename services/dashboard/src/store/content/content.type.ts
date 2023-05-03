import * as z from 'zod'

export const contentSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().nonempty('Name is required').min(2, 'Name must have at least 2 characters'),
    type: z.string().nonempty('Type is required'),
    url: z.string().optional(),
    file: z.instanceof(File).optional(),
    text: z.string().optional(),
    duration: z.number().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.duration === undefined && (value.type === 'Image' || value.type === 'Text')) {
      ctx.addIssue({
        message: 'Content of type Text or Image requires a duration time',
        code: z.ZodIssueCode.custom,
        path: ['duration'],
      })
    }
    if (value.type === 'Text' && !value.text?.length) {
      ctx.addIssue({
        message: 'Content of type Text requires some text to show',
        path: ['text'],
        code: z.ZodIssueCode.custom,
      })
    }
  })

export type ContentT = z.TypeOf<typeof contentSchema>
