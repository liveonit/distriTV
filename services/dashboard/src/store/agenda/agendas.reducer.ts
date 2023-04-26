import { AgendaActionTypes, AgendasState } from './agenda.state'
import { insertNewAddedEntity, refreshUpdatedEntity } from '../helpers'

const initialState: AgendasState = {
  items: [],
  isLoading: false,
}

const reducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case AgendaActionTypes.LIST_ALL_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case AgendaActionTypes.LIST_ALL_FAILURE:
      return {
        ...state,
        isLoading: false,
        items: [],
      }
    case AgendaActionTypes.LIST_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: payload,
      }
    case AgendaActionTypes.CREATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case AgendaActionTypes.CREATE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case AgendaActionTypes.CREATE_SUCCESS:
      return {
        ...state,
        items: insertNewAddedEntity(state.items, payload),
        isLoading: false
      }
    case AgendaActionTypes.EDIT_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case AgendaActionTypes.EDIT_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case AgendaActionTypes.EDIT_SUCCESS:
      return {
        ...state,
        items: refreshUpdatedEntity(state.items, payload),
        isLoading: false
      }
    default:
      return state
  }
}

export default reducer
