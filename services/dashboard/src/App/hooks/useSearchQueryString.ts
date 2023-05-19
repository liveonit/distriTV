import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export const useSearchQueryString = () => {
  const [searchParams] = useSearchParams()
  const [searchString, setSearchString] = useState<string | undefined>()
  useEffect(() => {
    setSearchString(searchParams.get('search') ?? undefined)
  }, [searchParams])
  return searchString
}
