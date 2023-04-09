import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@material-ui/core'
import { Control, Controller } from 'react-hook-form'

type FormInputDropdownPropsT = {
  name: string
  control: Control<any, any>
  label: string
  setValue?: any
  selectOptions: { value: string | number; label: string }[]
} & SelectProps

export const FormInputDropdown: React.FC<FormInputDropdownPropsT> = ({ name, control, label, selectOptions, ...otherProps }) => {
  const generateSingleOptions = () => {
    return selectOptions.map((option) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      )
    })
  }

  return (
    <FormControl fullWidth variant='outlined'>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Controller
        render={({ field: { onChange, value } }) => (
          <Select {...otherProps} labelId="demo-simple-select-label" onChange={onChange} value={value} label={label}>
            {generateSingleOptions()}
          </Select>
        )}
        control={control}
        name={name}
      />
    </FormControl>
  )
}
