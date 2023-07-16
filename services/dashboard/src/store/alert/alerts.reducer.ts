import { AlertActionTypes, AlertsState } from './alert.state'
import { refreshUpdatedEntity, removeDeletedEntity } from '../helpers'

const initialState: AlertsState = {
  items: [],
  isLoading: false,
}

const reducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case AlertActionTypes.LIST_ALL_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case AlertActionTypes.LIST_ALL_FAILURE:
      return {
        ...state,
        isLoading: false,
        items: [],
      }
    case AlertActionTypes.LIST_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: payload,
      }
    case AlertActionTypes.CREATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case AlertActionTypes.CREATE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case AlertActionTypes.CREATE_SUCCESS:
      let items = state.items.concat(payload)
      return {
        ...state,
        items,
        isLoading: false
      }
    case AlertActionTypes.EDIT_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case AlertActionTypes.EDIT_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case AlertActionTypes.EDIT_SUCCESS:
      return {
        ...state,
        items: refreshUpdatedEntity(state.items, payload),
        isLoading: false
      }
    case AlertActionTypes.DELETE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case AlertActionTypes.DELETE_SUCCESS:
      return {
        ...state,
        items: removeDeletedEntity(state.items, payload.id),
        isLoading: false
      }

    case AlertActionTypes.DELETE_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    default:
      return state
  }
}

export default reducer
