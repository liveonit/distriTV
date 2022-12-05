import { parseJwt } from 'src/App/helpers'

export type SessionT = {
  session: {
    type: 'local' | 'google'
    id: string
    accessToken: string
    refreshToken?: string
    tokenId?: string
  }
  roleMappings: RoleMapping[]
}

export type UserT = {
  id: string
  username: string
  enabled: string
  emailVerified: string
  firstName: string
  lastName: string
  email: string
  sessionId: string
  roleMappings: RoleMapping[]
  loginType: string
  exp: number
  iat: number
}

export type Role = {
  id: string
  name: string
  description: string
  permissions: PermissionT[]
}

export type Label = {
  id: number
  description: string
}

export type Content = {
  id: number
  name: string
  type: string
  duration: number
}

export type Television = {
  id: number
  ip: string
  mac: string
  notifications?: Notification[]
  labels?: Label[]
  contents?: Content[]
}

export type Institution = {
  id: number
  name: string
  city?: string
  locality?: string
  televisions?: Television[]
}

export type RoleMapping = {
  role: Role
  institution: Institution
}
export type PermissionT = {
  id: string
  name: string
  description: string
}

export const mapFromGoogleToPayload = (tokenId: string, roleMappings: RoleMapping[]) => {
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
