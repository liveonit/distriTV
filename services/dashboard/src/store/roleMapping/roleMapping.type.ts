import { InstitutionT } from '../institution/institution.type'
import { RoleT } from '../role/role.type'

export type RoleMappingT = {
  role: RoleT
  institution: InstitutionT
}

export type CreateRoleMappingT = {
  roleId: string
  institutionId: string
  userId: string
}

export type DeleteRoleMappingT = {
  roleId: string
  institutionId: string
  userId: string
}