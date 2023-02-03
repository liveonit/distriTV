import { RoleMappingT } from '../roleMapping/roleMapping.type'

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
