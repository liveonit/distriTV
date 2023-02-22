import { PermissionActionTypes, PermissionsState } from './permission.state'

const initialState: PermissionsState = {
  items: [],
  isLoading: false,
}

const reducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case PermissionActionTypes.LIST_ALL_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case PermissionActionTypes.LIST_ALL_FAILURE:
      return {
        ...state,
        isLoading: false,
        items: [],
      }
    case PermissionActionTypes.LIST_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: payload,
      }
    default:
      return state
  }
}

export default reducer
