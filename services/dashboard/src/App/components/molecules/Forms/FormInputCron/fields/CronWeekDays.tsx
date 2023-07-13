import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

type CronWeekDaysPropsT = {
  value: string[]
  onChange: any
} & SelectProps

export const CronWeekDays: React.FC<CronWeekDaysPropsT> = ({ value, onChange, ...otherProps }) => {
  const { t } = useTranslation()
  
  return (
    <FormControl fullWidth variant='outlined'>
      <InputLabel>WeekDays</InputLabel>
        <Select multiple {...otherProps} labelId="demo-simple-select-label" onChange={onChange} value={value} label={'WeekDays'}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(n => {
            return (
              <MenuItem key={n} value={n}>
                {t(n)}
              </MenuItem>
            )
          })}
        </Select>
    </FormControl>
  )
}
