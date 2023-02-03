import { EditRoleMappingActionCreator, EditRoleMappingPayload, RoleMappingActionTypes } from './roleMapping.state'

export const listRoleMappings = () => ({
  type: RoleMappingActionTypes.LIST_ALL_REQUEST,
})

export const editRoleMappingRoleMapping: (payload: EditRoleMappingPayload) => EditRoleMappingActionCreator = (payload) => ({
  type: RoleMappingActionTypes.LIST_ALL_REQUEST,
  payload
})
