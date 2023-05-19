import { useSearchParams } from 'react-router-dom'

export const useQueryString = () => {
  const [searchParams] = useSearchParams()

  const result: any = {}
  searchParams.forEach((value, key) => {
    result[key] = value
  })
  const resultString = Object.entries(result)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return resultString
}
