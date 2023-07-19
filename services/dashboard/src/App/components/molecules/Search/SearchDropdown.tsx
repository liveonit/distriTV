import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
interface SearchDropdownProps {
  options: string[]
  value: string
  onChange: (event: string) => void
  placeholder: string
}

const useStyles = makeStyles((theme) => ({
  b: {
    background: theme.palette.background.default,
  },
}))

export const SearchDropdown: React.FC<SearchDropdownProps> = ({ options, value, onChange, placeholder }) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValues = event.target.value as string
    onChange(selectedValues)
  }

  const classes = useStyles()
  return (
    <FormControl variant='outlined'>
      <InputLabel className={clsx(classes.b)} id='search-single-dropdown-label'>
        {placeholder}
      </InputLabel>
      <Select
        variant='outlined'
        value={value || ''}
        onChange={handleChange}
        style={{ minWidth: 200 }}
        labelId='search-single-dropdown-label'
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
        <MenuItem value=''>
          <em>None</em>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default SearchDropdown
