import { IUserActionTypes, IUsersState } from '../models/IUsersState'

const initialState: IUsersState = {
  users: [],
  isLoading: false,
}

const reducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case IUserActionTypes.LIST_ALL_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case IUserActionTypes.LIST_ALL_FAILURE:
      return {
        ...state,
        isLoading: false,
        users: [],
      }
    case IUserActionTypes.LIST_ALL_SUCCESS:
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
