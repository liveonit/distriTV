import { RoleMappingT } from '../roleMapping/roleMapping.type'

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
