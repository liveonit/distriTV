import { AuthActionCreator, AuthActionTypes, GoogleAuthActionCreator } from './AuthState'

export const login: (username: string, password: string) => AuthActionCreator = (username, password) => ({
  type: AuthActionTypes.LOGIN_REQUEST,
  payload: { username, password },
})

export const googleLogin: (id: string, tokenId: string, accessToken: string) => GoogleAuthActionCreator = (id, tokenId, accessToken) => ({
  type: AuthActionTypes.GOOGLE_LOGIN_REQUEST,
  payload: { id, tokenId, accessToken },
})


export const logout = () => ({ type: AuthActionTypes.LOGOUT_REQUEST })

export const setUserData = (userData: any) => ({ type: AuthActionTypes.SET_USER_DATA, payload: userData })
