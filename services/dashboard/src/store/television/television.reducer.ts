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
    default:
      return state
  }
}

export default reducer
