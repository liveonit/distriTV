import { PermissionT } from '../permission/permission.type'

export type RoleT = {
  id: string
  name: string
  description: string
  permissions: PermissionT[]
}

export type CreateRoleT = {
  id: string
  name: string
  description?: string
  permissionIds?: string[]
}


export type UpdateRoleT = {
  id: string
  name: string
  description?: string
  permissionIds?: string[]
}
