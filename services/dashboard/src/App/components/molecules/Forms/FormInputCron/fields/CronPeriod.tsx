import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@material-ui/core'
import { CronPeriodType } from '../types'

type CronPeriodPropsT = {
  value: CronPeriodType
  onChange: any
} & SelectProps

export const CronPeriod: React.FC<CronPeriodPropsT> = ({ value, onChange, ...otherProps }) => {
  return (
    <FormControl fullWidth variant='outlined'>
      <InputLabel>Periodo</InputLabel>
        <Select {...otherProps} labelId="demo-simple-select-label" onChange={onChange} value={value} label={'Periodo'}>
          <MenuItem key={'year'} value={'year'}>
            {'YEAR'}
          </MenuItem>
          <MenuItem key={'month'} value={'month'}>
            {'MES'}
          </MenuItem>
          <MenuItem key={'week'} value={'week'}>
            {'SEMANA'}
          </MenuItem>
          <MenuItem key={'day'} value={'day'}>
            {'DIA'}
          </MenuItem>
          <MenuItem key={'hour'} value={'hour'}>
            {'HORA'}
          </MenuItem>
        </Select>
    </FormControl>
  )
}
