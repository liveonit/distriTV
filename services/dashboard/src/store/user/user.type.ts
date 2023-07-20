import * as z from 'zod'

export enum RolesE {
  Admin = 'admin',
  User = 'user',
  Uploader = 'uploader',
  Approver = 'approver',
}
const rolesEnumSchema = z.nativeEnum(RolesE)

export const roleSchema = z.object({
  id: z.string(),
  name: rolesEnumSchema,
  description: z.string().optional(),
})
export type RoleT = z.TypeOf<typeof roleSchema>

const roleMappingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  roleId: z.string(),
  institutionId: z.string(),
  role: roleSchema,
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
