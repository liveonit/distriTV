import React from 'react'
import { MenuItem, Select, SelectProps } from '@material-ui/core'



type FormInputDropdownPropsT = {
  name: string
  label: string
  setValue?: any
  selectOptions: { value: string | number; label: string }[]
} & SelectProps

export const SearchDropdown: React.FC<FormInputDropdownPropsT> = ({ name, label, selectOptions, ...otherProps }) => {
  const generateSingleOptions = () => {
    return selectOptions.map((option) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      )
    })
  }

  return <Select {...otherProps} labelId="demo-simple-select-label" label={label}>
              {generateSingleOptions()}
            </Select>}