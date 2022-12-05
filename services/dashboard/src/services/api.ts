import { Observable } from 'rxjs'
import { ajax, AjaxResponse } from 'rxjs/ajax'
import { timeout as timeoutOp, retry } from 'rxjs/operators'
import { GLOBAL_CONFIGS } from 'src/App/configs'
import { SessionT } from 'src/store/models/Global'
import { storage } from 'src/utils/general/Storage'

interface RequestProps<Body> {
  path: string
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE'
  requireAuthType?: 'local' | 'google'
  body?: Body
  headers?: Readonly<Record<string, any>>
  retries?: number
  timeout?: number
}

const apiSvc = {
  request: <Body, Response>(props: RequestProps<Body>): Observable<AjaxResponse<Response>> => {
    const { body, method, path, requireAuthType, retries, timeout } = {
      method: 'GET',
      retries: 0,
      timeout: 2000,
      ...props,
    }

    const session = storage.get<SessionT>('session')?.session

    let headers = {
      ...props.headers,
    }

    if (requireAuthType === 'local')
      headers = {
        ...headers,
        authorization: `Bearer ${session?.accessToken}`,
        'auth-type': 'local',
      }
    if (requireAuthType === 'google')
      headers = {
        ...headers,
        'auth-type': 'google',
        authorization: `Bearer ${session?.tokenId}`,
      }

    console.log({ beforeSendRequest: { headers, session, requireAuthType }})
    return ajax<Response>({
      url: `${GLOBAL_CONFIGS.API_URL || ''}${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body,
    }).pipe(
      timeoutOp(timeout), // after 2s abort
      retry(retries), // retry 3x.
    )
  },
}

Object.freeze(apiSvc)
export default apiSvc
