import { useMemo } from 'react'
import { SessionT, UserT } from 'src/store/models/IUser'

import { parseJwt } from '../helpers'
import { useStorageValue } from './useStorageValue'

export const useUser = () => {
  const session = useStorageValue<SessionT>('session')
  const user = useMemo(() => session?.refreshToken && parseJwt<UserT>(session.refreshToken), [session?.refreshToken])
  return user
}
