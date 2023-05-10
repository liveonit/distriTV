import React from 'react'
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectProps } from '@material-ui/core'
import { Control, Controller } from 'react-hook-form'
import { Theme, useTheme } from '@mui/material/styles'

type FormInputDropdownMultiPropsT = {
  name: string
  control: Control<any, any>
  label: string
  setValue?: any
  selectOptions: { value: string | number; label: string }[]
} & SelectProps

function getStyles(label: string | number, labels: (string | number)[], theme: Theme) {
  return {
    fontWeight: labels.indexOf(label) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  }
}
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export const FormInputDropdownMulti: React.FC<FormInputDropdownMultiPropsT> = ({
  name,
  control,
  label,
  selectOptions,
  ...otherProps
}) => {
  const theme = useTheme()
  const optionValues = selectOptions.map((opt) => opt.value)
  return (
    <FormControl fullWidth variant='outlined'>
      <InputLabel id='demo-multiple-name-label'>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <Select
              {...otherProps}
              labelId='demo-multiple-name-label'
              id='demo-multiple-name'
              multiple
              value={value}
              onChange={onChange}
              input={<OutlinedInput label='Name' />}
              MenuProps={MenuProps}
              renderValue={(selected: any) =>
                selected.map((sel: number | string) => selectOptions.find((o) => o.value === sel)?.label).join(', ')
              }
            >
              {selectOptions.map((option) => (
                <MenuItem key={option.value} value={option.value} style={getStyles(option.value, optionValues, theme)}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )
        }}
      />
    </FormControl>
  )
}
