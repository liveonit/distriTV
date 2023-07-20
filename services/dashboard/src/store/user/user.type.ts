import * as z from 'zod'

import { institutionSchema } from '../institution/institution.type'

export enum RolesE {
  Admin = 'admin',
  User = 'user',
  Uploader = 'uploader',
  Approver = 'approver',
}
const rolesEnumSchema = z.nativeEnum(RolesE)

const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
})

export type RoleT = z.TypeOf<typeof roleSchema>

const roleMappingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  roleId: z.string(),
  institutionId: z.number(),
  role: roleSchema,
  institution: institutionSchema,
})
export type RoleMappingT = z.TypeOf<typeof roleMappingSchema>

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  loginType: z.enum(['local', 'google']),
  enabled: z.boolean(),
  emailVerified: z.boolean(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  roleMappings: z.array(roleMappingSchema),
})
export type UserT = z.TypeOf<typeof userSchema>

export const createUserSchema = z.object({
  id: z.string().optional(),
  username: z.string(),
  password: z
    .string()
    .min(8, { message: 'Password should be at least 8 characters long' })
    .regex(new RegExp('.*[A-Z].*'), 'Password should contain at least one uppercase letter')
    .regex(new RegExp('.*[a-z].*'), 'Password should contain at least one lowercase letter')
    .regex(new RegExp('.*[0-9].*'), 'Password should contain at least one number')
    .regex(
      new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
      'Password should contain at least one special character',
    ),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  roleName: rolesEnumSchema,
  institutionId: z.number(),
  m2mRelations: z
    .array(
      z.object({
        roleMappings: z.array(z.object({ institutionId: z.number(), roleName: z.string() })),
      }),
    )
    .optional(),
})

export type CreateUserT = z.TypeOf<typeof createUserSchema>

export const updateUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z
    .string()
    .min(8, { message: 'Password should be at least 8 characters long' })
    .regex(new RegExp('.*[A-Z].*'), 'Password should contain at least one uppercase letter')
    .regex(new RegExp('.*[a-z].*'), 'Password should contain at least one lowercase letter')
    .regex(new RegExp('.*[0-9].*'), 'Password should contain at least one number')
    .regex(
      new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
      'Password should contain at least one special character',
    )
    .optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  roleName: rolesEnumSchema,
  institutionId: z.number(),
  m2mRelations: z
    .array(
      z.object({
        roleMappings: z.array(z.object({ institutionId: z.number(), roleName: z.string() })),
      }),
    )
    .optional(),
})

export type UpdateUserT = z.TypeOf<typeof updateUserSchema>
