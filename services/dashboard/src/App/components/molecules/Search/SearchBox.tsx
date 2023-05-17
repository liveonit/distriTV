import { Box } from '@mui/material';
import React from 'react'
import { useSearchParams } from "react-router-dom";
import { SearchInput } from './SearchInput';
import { SearchDropdown } from './SearchDropdown'
// <SearchBox search={{ name: InputText ,  "television.institution.id": Select,  }} />

interface SearchBoxT<T> {
  searches: { [K in keyof T]: {
      type: "Input" | "Select",
      name: string,
      options?: string[]
  } }
  onChange: (apiQuery: string) => void
}



export const SearchBox: React.FC<SearchBoxT> = ({ searches, onChange }) => {
  const [state, setState] = React.useState<any>({})
  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
      searchParams.forEach(search => {s})
      setState() }, []) 

  React.useEffect(() => {
      const query = Object.values(state).join(';')
      setSearchParams(query)
      onChange(query)
  }, [state])

  const searchBar = searches.map((search: { type: any; name: string; }) => {
    switch (search.type) {
      case 'Input': {
        return (
          <SearchInput
            name={search.name}
            value={state[search.name]}
            onChange={(value) => setState({ ...state, [search.name]: value })}
          />
        )
      }
      case 'Select': {
        return (
          <SearchDropdown
            name={search.name}
            value={state[search.name]}
            onChange={(value) => setState({ ...state, [search.name]: value })}
          />
        )
      }
      default: {
        return <></>
      }
    }
  })

  return <Box>{searchBar}</Box>
}

