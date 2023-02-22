import { useMemo } from 'react'
import { mapFromGoogleToPayload } from 'src/store/auth/auth.state'
import { SessionT } from 'src/store/auth/auth.type'
import { UserT } from 'src/store/user/user.type'

import { parseJwt } from '../helpers'
import { useStorageValue } from './useStorageValue'

export const useUser = () => {
  const session = useStorageValue<SessionT>('session')
  const user = useMemo(() => {
    if (session?.session?.type === 'local') return parseJwt<UserT>(session.session.refreshToken!)
    if (session?.session?.type === 'google') return mapFromGoogleToPayload(session.session.tokenId!, session.roleMappings)
    return null
  }, [session])
  return user
}
