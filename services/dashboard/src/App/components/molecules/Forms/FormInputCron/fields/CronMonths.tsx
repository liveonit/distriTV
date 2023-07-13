import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@material-ui/core'
import { Trans, useTranslation } from 'react-i18next'

type CronMonthsPropsT = {
  value: string[]
  onChange: any
} & SelectProps

export const CronMonths: React.FC<CronMonthsPropsT> = ({ value, onChange, ...otherProps }) => {
  const { t } = useTranslation()

  return (
    <FormControl fullWidth variant='outlined'>
      <InputLabel><Trans>EVERY</Trans> <Trans>MONTH</Trans></InputLabel>
        <Select multiple {...otherProps} labelId="demo-simple-select-label" onChange={onChange} value={value} label={'Months'}>
          {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map(n => {
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
