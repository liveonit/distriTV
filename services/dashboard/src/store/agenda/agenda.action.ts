import { AgendaActionTypes } from './agenda.state'
import { AgendaT } from './agenda.type'

export const listAgendas = () => ({
  type: AgendaActionTypes.LIST_ALL_REQUEST,
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
  type: AgendaActionTypes.EDIT_REQUEST,
  payload
})
