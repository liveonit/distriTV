export type SessionT = {
  id: string
  accessToken: string
  refreshToken: string
}

export type UserT = {
  id: string
  username: string
  enabled: string
  emailVerified: string
  firstName: string
  lastName: string
  email: string
  roles: string
  sessionId: string
  exp: number
  iat: number
}

export type RoleT = {
  id: string
  name: string
  description: string
  permissions: PermissionT[]
}

export type PermissionT = {
  id: string
  name: string
  description: string
}
