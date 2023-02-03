import { EditRoleActionCreator, EditRolePayload } from '../role/role.state'
import { UserActionTypes } from './user.state'

export const listUsers = () => ({
  type: UserActionTypes.LIST_ALL_REQUEST,
})

export const editUserRole: (payload: EditRolePayload) => EditRoleActionCreator = (payload) => ({
  type: UserActionTypes.LIST_ALL_REQUEST,
  payload,
})
