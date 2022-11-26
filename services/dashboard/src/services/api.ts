import { Observable } from 'rxjs'
import { ajax, AjaxResponse } from 'rxjs/ajax'
import { timeout as timeoutOp, retry } from 'rxjs/operators'
import { GLOBAL_CONFIGS } from 'src/App/configs'
import { SessionT } from 'src/store/models/IUser'
import { storage } from 'src/utils/general/Storage'

interface RequestProps<Body> {
  path: string
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE'
  requireAuth?: boolean
  body?: Body
  headers?: Readonly<Record<string, any>>
  retries?: number
  timeout?: number
}

const apiSvc = {
  request: <Body, Response>(
    props: RequestProps<Body>,
  ): Observable<AjaxResponse<Response>> => {
    const { body, method, path, requireAuth, retries, timeout } = {
      method: 'GET',
      requireAuth: false,
      retries: 0,
      timeout: 2000,
      ...props
    }

    let headers = {
      ...props.headers,
    }

    if (requireAuth)
      headers = {
        ...headers,
        // FIXME: get and set token
        Authorization: `Bearer ${storage.get<SessionT>('session')?.accessToken}`,
      }
      
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
