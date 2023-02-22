import { EditPermissionActionCreator, EditPermissionPayload, PermissionActionTypes } from './permission.state'

export const listPermissions = () => ({
  type: PermissionActionTypes.LIST_ALL_REQUEST,
})

export const editPermission: (payload: EditPermissionPayload) => EditPermissionActionCreator = (payload) => ({
  type: PermissionActionTypes.LIST_ALL_REQUEST,
  payload
})
