import { EditRoleActionCreator, EditRolePayload, RoleActionTypes } from './role.state'

export const listRoles = () => ({
  type: RoleActionTypes.LIST_ALL_REQUEST,
})

export const editRoleRole: (payload: EditRolePayload) => EditRoleActionCreator = (payload) => ({
  type: RoleActionTypes.LIST_ALL_REQUEST,
  payload
})
