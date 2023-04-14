import { insertNewAddedEntity, refreshUpdatedEntity, removeDeletedEntity } from '../helpers'
import { TelevisionActionTypes, TelevisionState } from './television.state'

const initialState: TelevisionState = {
  items: [],
  isLoading: false,
}

const reducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case TelevisionActionTypes.LIST_ALL_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case TelevisionActionTypes.LIST_ALL_FAILURE:
      return {
        ...state,
        isLoading: false,
        items: [],
      }
    case TelevisionActionTypes.LIST_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: payload,
      }
    case TelevisionActionTypes.CREATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case TelevisionActionTypes.CREATE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case TelevisionActionTypes.CREATE_SUCCESS:
      return {
        ...state,
        items: insertNewAddedEntity(state.items, payload),
        isLoading: false
      }
    case TelevisionActionTypes.EDIT_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case TelevisionActionTypes.EDIT_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case TelevisionActionTypes.EDIT_SUCCESS:
      return {
        ...state,
        items: refreshUpdatedEntity(state.items, payload),
        isLoading: false
      }
    case TelevisionActionTypes.DELETE_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case TelevisionActionTypes.DELETE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case TelevisionActionTypes.DELETE_SUCCESS:
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
