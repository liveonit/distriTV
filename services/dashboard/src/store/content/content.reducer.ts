import { ContentActionTypes, ContentState } from './content.state'
import { insertNewAddedEntity, refreshUpdatedEntity, removeDeletedEntity } from '../helpers'
const initialState: ContentState = {
  items: [],
  isLoading: false,
}

const reducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case ContentActionTypes.LIST_ALL_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case ContentActionTypes.LIST_ALL_FAILURE:
      return {
        ...state,
        isLoading: false,
        items: [],
      }
    case ContentActionTypes.LIST_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: payload,
      }
    case ContentActionTypes.CREATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case ContentActionTypes.CREATE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case ContentActionTypes.CREATE_SUCCESS:
      return {
        ...state,
        items: insertNewAddedEntity(state.items, payload),
        isLoading: false
      }
    case ContentActionTypes.EDIT_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case ContentActionTypes.EDIT_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case ContentActionTypes.EDIT_SUCCESS:
      return {
        ...state,
        items: refreshUpdatedEntity(state.items, payload),
        isLoading: false
      }
    case ContentActionTypes.DELETE_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case ContentActionTypes.DELETE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case ContentActionTypes.DELETE_SUCCESS:
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
