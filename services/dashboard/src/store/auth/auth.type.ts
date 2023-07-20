import { RoleMappingT } from '../user/user.type'

export type SessionT = {
  session: {
    type: 'local' | 'google'
    id: string
    accessToken: string
    refreshToken?: string
    tokenId?: string
  }
  roleMappings: any[]
}

export type UserSessionT = {
  id: string
  username: string
  enabled: string
  emailVerified: string
  firstName: string
  lastName: string
  email: string
  sessionId: string
  roleMappings: RoleMappingT[]
  loginType: string
  exp: number
  iat: number
}
