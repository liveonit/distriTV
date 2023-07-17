import { AlertActionTypes } from './alert.state'
import { AlertT } from './alert.type'

export const listAlerts = (payload?: { query?: string }) => ({
  type: AlertActionTypes.LIST_ALL_REQUEST,
  payload
})

export const createAlert = (payload: AlertT) => ({
  type: AlertActionTypes.CREATE_REQUEST,
  payload
})

export const updateAlert = (payload: AlertT) => ({
  type: AlertActionTypes.EDIT_REQUEST,
  payload
})

export const deleteAlert = (payload: { id: number | string }) => ({
  type: AlertActionTypes.DELETE_REQUEST,
  payload
})
