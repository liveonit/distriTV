import { Box } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { SearchInput } from './SearchInput'
import Button from '@material-ui/core/Button'
import { Trans } from 'react-i18next'
import Search from '@material-ui/icons/Search'
import SearchDropdown from './SearchDropdown'
import SearchDropdownMulti from './SearchDropdownMulti'

interface SearchBoxT {
  searches: {
    type: 'Input' | 'Select' | 'Multi'
    name: string
    placeholder: string
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

  const searchBar = searches.map((search: { type: any; name: string; placeholder: string, options?: string[] }) => {
    switch (search.type) {
      case 'Input': {
        return (
          <SearchInput value={state[search.name]} placeholder={search.placeholder} onChange={(value) => setState({ ...state, [search.name]: value })} />
        )
      }
      case 'Select': {        
        return (
          <SearchDropdown options={search.options || []} placeholder={search.placeholder} value={state[search.name] || ""} onChange={(value) => setState({ ...state, [search.name]: value })} />
        )
      }
      case 'Multi': {        
        return (
          <SearchDropdownMulti 
            options={search.options || []} 
            placeholder={search.placeholder} 
            value={(typeof state[search.name]) === 'undefined' ? 
              [] 
              : Array.isArray(state[search.name]) ?
                state[search.name] 
                : state[search.name].split(',')} 
            onChange={(value) => setState({ ...state, [search.name]: value })} />
        )
      }
      default: {
        return <></>
      }
    }
  })

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
      {searchBar}
      <Button
        variant='contained'
        color='primary'
        size='small'
        startIcon={<Search />}
        onClick={setSearch}            
      >
        <Trans>SEARCH</Trans>
      </Button>
    </Box>
  )
}
