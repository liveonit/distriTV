import React from 'react'

// <SearchBox search={{ name: InputText ,  "television.institution.id": Select,  }} />

interface SearchInput {
  name: string
  onChange: (value: string) => void
  value: string
}

export const SearchInput: React.FC<SearchInput> = ({ value, name, onChange  }) => {
  const parsedValue = value.split(':')[1]
  return <input value={parsedValue} onChange={(e) => onChange(`${name}:${e.target.value}`)}></input>
}

