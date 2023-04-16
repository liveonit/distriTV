import { TelevisionActionTypes } from './television.state'
import { TelevisionT } from './television.type'

export const listTelevisions = () => ({
  type: TelevisionActionTypes.LIST_ALL_REQUEST,
})

export const listTelevisionsJoin = () => ({
  type: TelevisionActionTypes.LIST_ALL_JOIN_REQUEST,
})

export const createTelevision = (payload: TelevisionT) => ({
  type: TelevisionActionTypes.CREATE_REQUEST,
  payload
})

export const updateTelevision = (payload: TelevisionT) => ({
  type: TelevisionActionTypes.EDIT_REQUEST,
  payload
})

export const deleteTelevision = (payload: { id: number | string }) => ({
  type: TelevisionActionTypes.DELETE_REQUEST,
  payload
})
