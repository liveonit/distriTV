import apiSvc from 'src/services/api'

export const fetchTodo = async (path: string) => {
  return apiSvc.request({
    path,
    body: {
      showSpinner: true,
    },
  })
}

export const fetchMultiRequest = async (path: string) => {
  return apiSvc.request({
    path
  })
}
