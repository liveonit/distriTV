import React from 'react'

// <SearchBox search={{ name: InputText ,  "television.institution.id": Select,  }} />

interface SearchInput {
  onChange: (value: string) => void
  value: string
}

export const SearchInput: React.FC<SearchInput> = ({ value, onChange }) => {
  return <input value={value} onChange={(e) => onChange(e.target.value)}></input>
}
