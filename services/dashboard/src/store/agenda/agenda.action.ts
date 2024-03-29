import { AgendaActionTypes } from './agenda.state'
import { AgendaT } from './agenda.type'

export const listAgendas = (payload?: { query?: string }) => ({
  type: AgendaActionTypes.LIST_ALL_REQUEST,
  payload
})

export const createAgenda = (payload: AgendaT) => ({
  type: AgendaActionTypes.CREATE_REQUEST,
  payload
})

export const updateAgenda = (payload: AgendaT) => ({
  type: AgendaActionTypes.EDIT_REQUEST,
  payload
})

export const deleteAgenda = (payload: { id: number | string }) => ({
  type: AgendaActionTypes.DELETE_REQUEST,
  payload
})
