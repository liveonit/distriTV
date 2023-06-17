import {TextField} from '@material-ui/core'
import React from 'react'

// <SearchBox search={{ name: InputText ,  "television.institution.id": Select,  }} />

interface SearchInput {
  onChange: (value: string) => void
  value: string,
  placeholder: string
}

export const SearchInput: React.FC<SearchInput> = ({ value, onChange, placeholder }) => {
  return <TextField 
            value={value} 
            variant='outlined'
            label={placeholder}
            onChange={(e) => onChange(e.target.value)}>
          </TextField>
}
