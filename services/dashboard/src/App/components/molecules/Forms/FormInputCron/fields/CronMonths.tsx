import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@material-ui/core'

type CronMonthsPropsT = {
  value: string[]
  onChange: any
} & SelectProps

export const CronMonths: React.FC<CronMonthsPropsT> = ({ value, onChange, ...otherProps }) => {
  return (
    <FormControl fullWidth variant='outlined'>
      <InputLabel>Months</InputLabel>
        <Select multiple {...otherProps} labelId="demo-simple-select-label" onChange={onChange} value={value} label={'Months'}>
          {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map(n => {
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
