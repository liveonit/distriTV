import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@material-ui/core'
import { Trans } from 'react-i18next'

type CronMinutesPropsT = {
  value: number[]
  onChange: any
} & SelectProps

export const CronMinutes: React.FC<CronMinutesPropsT> = ({ value, onChange, ...otherProps }) => {
  return (
    <FormControl fullWidth variant='outlined'>
      <InputLabel><Trans>EVERY</Trans> <Trans>MINUTE</Trans></InputLabel>
        <Select multiple {...otherProps} labelId="demo-simple-select-label" onChange={onChange} value={value} label={'Minutes'}>
          {[...Array(60).keys()].map(n => {
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
