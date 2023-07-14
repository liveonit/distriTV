import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@material-ui/core'
import { Trans } from 'react-i18next'

type CronDaysPropsT = {
  value: number[]
  onChange: any
} & SelectProps

export const CronDays: React.FC<CronDaysPropsT> = ({ value, onChange, ...otherProps }) => {
  return (
    <FormControl fullWidth variant='outlined'>
      <InputLabel><Trans>EVERY</Trans> <Trans>DAY_OF_MONTH</Trans></InputLabel>
        <Select multiple {...otherProps} labelId="demo-simple-select-label" onChange={onChange} value={value} label={'Days'}>
          {[...Array(32).keys()].slice(1).map(n => {
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
