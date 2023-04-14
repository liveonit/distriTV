import { insertNewAddedEntity, refreshUpdatedEntity, removeDeletedEntity } from '../helpers'
import { LabelActionTypes, LabelState } from './label.state'

const initialState: LabelState = {
  items: [],
  isLoading: false,
}

const reducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case LabelActionTypes.LIST_ALL_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case LabelActionTypes.LIST_ALL_FAILURE:
      return {
        ...state,
        isLoading: false,
        items: [],
      }
    case LabelActionTypes.LIST_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: payload,
      }
    case LabelActionTypes.CREATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case LabelActionTypes.CREATE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case LabelActionTypes.CREATE_SUCCESS:
      return {
        ...state,
        items: insertNewAddedEntity(state.items, payload),
        isLoading: false
      }
    case LabelActionTypes.EDIT_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case LabelActionTypes.EDIT_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case LabelActionTypes.EDIT_SUCCESS:
      return {
        ...state,
        items: refreshUpdatedEntity(state.items, payload),
        isLoading: false
      }
    case LabelActionTypes.DELETE_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case LabelActionTypes.DELETE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case LabelActionTypes.DELETE_SUCCESS:
      return {
        ...state,
        items: removeDeletedEntity(state.items, payload.id),
        isLoading: false
      }
    default:
      return state
  }
}

export default reducer
