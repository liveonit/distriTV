import { parseJwt } from 'src/App/helpers'

export type SessionT = {
  session: {
    type: 'local' | 'google'
    id: string
    accessToken: string
    refreshToken?: string
    tokenId?: string
  }
  roleMappings: RoleMappingT[]
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
  roleMappings: RoleMappingT[]
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

export type LabelT = {
  id: number
  description: string
}

export type ContentT = {
  id: number
  name: string
  type: string
  duration: number
}

export type TelevisionT = {
  id: number
  ip: string
  mac: string
  notifications?: Notification[]
  labels?: LabelT[]
  contents?: ContentT[]
}

export type InstitutionT = {
  id: number
  name: string
  city?: string
  locality?: string
  televisions?: TelevisionT[]
}

export type RoleMappingT = {
  role: Role
  institution: InstitutionT
}
export type PermissionT = {
  id: string
  name: string
  description: string
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
