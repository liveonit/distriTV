import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@material-ui/core'

type CronHoursPropsT = {
  value: number
  onChange: any
} & SelectProps

export const CronHours: React.FC<CronHoursPropsT> = ({ value, onChange, ...otherProps }) => {
  return (
    <FormControl fullWidth variant='outlined'>
      <InputLabel>Hours</InputLabel>
        <Select {...otherProps} labelId="demo-simple-select-label" onChange={onChange} value={value} label={'Hours'}>
          {[...Array(24).keys()].map(n => {
            return (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            )
          })}
        </Select>
    </FormControl>
  )
}
