import { UserActionTypes, UsersState } from './UsersState'

const initialState: UsersState = {
  users: [],
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
        users: [],
      }
    case UserActionTypes.LIST_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        users: payload,
      }
    default:
      return state
  }
}

export default reducer
