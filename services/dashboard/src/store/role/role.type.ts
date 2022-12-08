import { PermissionT } from '../permission/permission.type'

export type RoleT = {
  id: string
  name: string
  description: string
  permissions: PermissionT[]
}
