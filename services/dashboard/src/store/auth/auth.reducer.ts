import { AuthActionTypes, AuthActionCreator, AuthState } from 'src/store/auth/AuthState'

const initialState: AuthState = {
  user: null,
}

const reducer = (state = initialState, { type }: AuthActionCreator) => {
  switch (type) {
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
      }
    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
      }
    case AuthActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
      }
    case AuthActionTypes.SILENT_LOGIN:
      return {
        ...state,
      }
    default:
      return state
  }
}

export default reducer
