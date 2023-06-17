import React from 'react'

// <SearchBox search={{ name: InputText ,  "television.institution.id": Select,  }} />

interface SearchInput {
  onChange: (value: string) => void
  value: string,
  placeholder: string
}

export const SearchInput: React.FC<SearchInput> = ({ value, onChange, placeholder }) => {
  return <input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}></input>
}
