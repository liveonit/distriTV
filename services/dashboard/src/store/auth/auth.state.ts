import { parseJwt } from 'src/App/helpers'

import { RoleMappingT } from '../roleMapping/roleMapping.type';
import { UserT } from '../user/user.type';

export enum AuthActionTypes {
  LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST',
  LOGIN_SUCCESS = 'AUTH/LOGIN_SUCCESS',
  LOGIN_FAILURE = 'AUTH/LOGIN_FAILURE',
  SILENT_LOGIN = 'AUTH/SILENT_LOGIN',
  LOGOUT_REQUEST = 'AUTH/LOGOUT_REQUEST',
  LOGOUT_SUCCESS = 'AUTH/LOGOUT_SUCCESS',
  LOGOUT_FAILURE = 'AUTH/LOGOUT_FAILURE',
  SET_USER_DATA = 'AUTH/SET_USER_DATA',
  GOOGLE_LOGIN_REQUEST = 'AUTH/GOOGLE_LOGIN_REQUEST',
  GOOGLE_LOGIN_SUCCESS = 'AUTH/GOOGLE_LOGIN_SUCCESS',
  GOOGLE_LOGIN_FAILURE = 'AUTH/GOOGLE_LOGIN_FAILURE',
}

export type AuthState = {
  user: any | null
}

export type AuthActionCreatorPayload = { username: string; password: string }

export type AuthActionCreator = {
  type: string
  payload: AuthActionCreatorPayload
}

export type GoogleAuthActionCreatorPayload = { id: string; tokenId: string; accessToken: string }

export type GoogleAuthActionCreator = {
  type: string
  payload: GoogleAuthActionCreatorPayload
}

export const mapFromGoogleToPayload = (tokenId: string, roleMappings: RoleMappingT[]) => {
  const googlePayload = parseJwt(tokenId) as any
  return {
    id: googlePayload.sub,
    username: googlePayload.email,
    firstName: googlePayload.given_name,
    lastName: googlePayload.family_name,
    emailVerified: googlePayload.email_verified,
    roleMappings,
  } as UserT
}
