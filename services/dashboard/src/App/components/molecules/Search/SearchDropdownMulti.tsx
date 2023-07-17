import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import React from 'react'
interface SearchDropdownProps {
  options: string[]
  value: string[]
  onChange: (event: string) => void
  placeholder: string
}

export const SearchDropdownMulti: React.FC<SearchDropdownProps> = ({ options, value, onChange, placeholder }) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValues = event.target.value as string
    onChange(selectedValues)
  }

  return (
    <FormControl variant='outlined'>
      <InputLabel id='search-multi-dropdown-label'>{placeholder}</InputLabel>
      <Select
        multiple
        labelId='search-multi-dropdown-label'
        variant='outlined'
        value={value.includes('') ? [] : value}
        onChange={handleChange}
        style={{ minWidth: 200 }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SearchDropdownMulti
