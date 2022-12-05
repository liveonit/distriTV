import { GLOBAL_CONFIGS } from 'src/App/configs'

export function loggerMiddleware(store: any) {
  return (next: any) => (action: any) => {
    if (GLOBAL_CONFIGS.DEBUG_STORE) {
      console.group(action.type)
      console.info('dispatching', action)
    }
    const result = next(action)
    if (GLOBAL_CONFIGS.DEBUG_STORE) {
      console.log('next state', store.getState())
      console.groupEnd()
    }
    return result
  }
}
