import { InstitutionActionTypes, InstitutionsState } from './InstitutionState'

const initialState: InstitutionsState = {
  institutions: [],
  isLoading: false,
}

const reducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case InstitutionActionTypes.LIST_ALL_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case InstitutionActionTypes.LIST_ALL_FAILURE:
      return {
        ...state,
        isLoading: false,
        institutions: [],
      }
    case InstitutionActionTypes.LIST_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        institutions: payload,
      }
    default:
      return state
  }
}

export default reducer
