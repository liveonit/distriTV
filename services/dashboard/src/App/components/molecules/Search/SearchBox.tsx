import { Box } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { SearchInput } from './SearchInput'

interface SearchBoxT {
  searches: {
    type: 'Input' | 'Select'
    name: string
    options?: string[]
  }[]
}
export const SearchBox: React.FC<SearchBoxT> = ({ searches }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, setState] = React.useState<any>({})

  React.useEffect(() => {
    const initialState: any = {}
    searchParams
      .get('search')
      ?.split(';')
      .forEach((searchTerm) => {
        const [searchKey, searchValue] = searchTerm.split(':')
        initialState[searchKey] = searchValue
      })
    setState(initialState)
  }, [])

  const setSearch = () =>
    setSearchParams((prevParams) => {
      return new URLSearchParams({
        ...Object.fromEntries(prevParams.entries()),
        search: Object.entries(state)
          .map(([key, value]) => `${key}:${value}`)
          .join(';'),
      })
    })
  const searchBar = searches.map((search: { type: any; name: string }) => {
    switch (search.type) {
      case 'Input': {
        return (
          <SearchInput value={state[search.name]} onChange={(value) => setState({ ...state, [search.name]: value })} />
        )
      }
      default: {
        return <></>
      }
    }
  })

  return (
    <Box>
      {searchBar}
      <button onClick={setSearch}>Search</button>
    </Box>
  )
}
