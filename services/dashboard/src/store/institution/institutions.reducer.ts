import { InstitutionActionTypes, InstitutionsState } from './institution.state'

const initialState: InstitutionsState = {
  items: [],
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
        items: [],
      }
    case InstitutionActionTypes.LIST_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: payload,
      }
    case InstitutionActionTypes.CREATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case InstitutionActionTypes.CREATE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case InstitutionActionTypes.CREATE_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case InstitutionActionTypes.EDIT_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case InstitutionActionTypes.EDIT_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case InstitutionActionTypes.EDIT_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}

export default reducer
