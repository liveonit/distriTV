import { storage } from 'src/utils/general/Storage'
import { parseJwt } from 'src/App/helpers'
import { GLOBAL_CONFIGS } from 'src/App/configs'
import { SessionT } from 'src/store/auth/auth.type'
import { UserT } from 'src/store/user/user.type'

export const checkOrRefreshToken = async () => {
  const session = storage.get<SessionT>('session')
  if (!session?.session?.refreshToken && !session?.session?.tokenId) {
    throw new Error('User requires authentication')
  }
  if (session?.session.refreshToken && session?.session.accessToken) {
    const accessExp = parseJwt<UserT>(session.session.accessToken)?.exp
    const refreshExp = parseJwt<UserT>(session.session.refreshToken)?.exp
    if (!refreshExp || !accessExp || new Date() > new Date(refreshExp * 1000))
      throw new Error('User requires authentication')
    if (new Date() > new Date(accessExp * 1000)) {
      const result = await fetch(`${GLOBAL_CONFIGS.API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: session.session.refreshToken }),
      })
      const response = await result.json()
      const userPayload = parseJwt<UserT>(response.refreshToken)
      if (!userPayload) throw Error('Invalid user payload')
      storage.set('session', {
        session: { ...(response as any), type: 'local' },
        roleMappings: userPayload.roleMappings,
      })
    }
  }
  return session
}
