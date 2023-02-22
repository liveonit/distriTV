import { RoleMappingActionTypes, RoleMappingState } from './roleMapping.state'

const initialState: RoleMappingState = {
  items: [],
  isLoading: false,
}

const reducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case RoleMappingActionTypes.LIST_ALL_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case RoleMappingActionTypes.LIST_ALL_FAILURE:
      return {
        ...state,
        isLoading: false,
        items: [],
      }
    case RoleMappingActionTypes.LIST_ALL_SUCCESS:
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
