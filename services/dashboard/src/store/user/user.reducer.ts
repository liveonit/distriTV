import { insertNewAddedEntity, refreshUpdatedEntity, removeDeletedEntity } from '../helpers'
import { UserActionTypes, UsersState } from './user.state'

const initialState: UsersState = {
  items: [],
  isLoading: false,
}

const reducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case UserActionTypes.LIST_ALL_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case UserActionTypes.LIST_ALL_FAILURE:
      return {
        ...state,
        isLoading: false,
        items: [],
      }
    case UserActionTypes.LIST_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: payload,
      }
    case UserActionTypes.CREATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case UserActionTypes.CREATE_FAILURE:
      return {
        ...state,
        isLoading: false,
      }
    case UserActionTypes.CREATE_SUCCESS:
      return {
        ...state,
        items: insertNewAddedEntity(state.items, payload),
        isLoading: false,
      }
    case UserActionTypes.EDIT_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case UserActionTypes.EDIT_FAILURE:
      return {
        ...state,
        isLoading: false,
      }
    case UserActionTypes.EDIT_SUCCESS:
      return {
        ...state,
        items: refreshUpdatedEntity(state.items, payload),
        isLoading: false,
      }
    case UserActionTypes.DELETE_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case UserActionTypes.DELETE_FAILURE:
      return {
        ...state,
        isLoading: false,
      }
    case UserActionTypes.DELETE_SUCCESS:
      return {
        ...state,
        items: removeDeletedEntity(state.items, payload.id),
        isLoading: false,
      }
    default:
      return state
  }
}

export default reducer
