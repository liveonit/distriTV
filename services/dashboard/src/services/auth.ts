import { storage } from 'src/utils/general/Storage'
import { SessionT, UserT } from 'src/store/models/IUser'
import { parseJwt } from 'src/App/helpers'
import { GLOBAL_CONFIGS } from 'src/App/configs'

export const checkOrRefreshToken = async () => {
  const session = storage.get<SessionT>('session')
  if (!session?.refreshToken || !session?.accessToken) throw new Error('User requires authentication')
  const accessExp = parseJwt<UserT>(session.accessToken)?.exp
  const refreshExp = parseJwt<UserT>(session.refreshToken)?.exp
  if (!refreshExp || !accessExp || new Date() > new Date(refreshExp * 1000))
    throw new Error('User requires authentication')
  if (new Date() > new Date(accessExp * 1000)) {
    const result = await fetch(`${GLOBAL_CONFIGS.API_URL}/user/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken:  session.refreshToken }),
    })
    const response = await result.json()
    storage.set('session', response)
  }
  return session
}
