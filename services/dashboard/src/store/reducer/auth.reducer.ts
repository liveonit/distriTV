import { IAuthActionTypes, IAuthActionCreator, IAuthState } from '@store/models/IAuthState'

const initialState: IAuthState = {
  user: null,
}

const reducer = (state = initialState, { type }: IAuthActionCreator) => {
  switch (type) {
    case IAuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
      }
    case IAuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
      }
    case IAuthActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
      }
    case IAuthActionTypes.SILENT_LOGIN:
      return {
        ...state,
      }
    default:
      return state
  }
}

export default reducer
