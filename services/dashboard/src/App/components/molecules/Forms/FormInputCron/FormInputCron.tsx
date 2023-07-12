import React, { useEffect, useState } from 'react'
import { Control, Controller/*, useController */} from 'react-hook-form'
import { Box, FormControl } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'

import TypographyBase from '../../../atoms/TypographyBase'
// import { CronPeriodType } from './types'
import { CronPeriod } from './fields/CronPeriod'
import { CronMinutes } from './fields/CronMinutes'
import { CronHours } from './fields/CronHours'

const useStyles = makeStyles((theme: Theme) => ({
  borderColor: {
    border: `1px solid ${theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(206, 203, 203, 0.12)'}`,
  },
  borderRadius: {
    borderRadius: '0.5em',
  },
}))

type FormInputCronPropsT = {
  name: string
  control: Control<any, any>
  label: string
  setValue?: any
}



export const FormInputCron: React.FC<FormInputCronPropsT> = ({ name, control, label }) => {
  const classes = useStyles()
  // const { field } = useController({ name, control })
  const [period, setPeriod] = useState<any>('month')
  const [hours, setHours] = useState<any>(0)
  const [minutes, setMinutes] = useState<any>(0)

  useEffect(
    () => {
      // ACA LLAMAR A LAS FUNCIONES QUE SETEAN LOS DROPDOWN, O SEA, LLAMAR EL SET PERIOD ETC
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const switcheando = () => {
    switch (period) {
      case 'month':
        return <p>MES</p>
      case 'day':
        return <>
          <CronHours value={hours} onChange={(newValue: { target: { value: any } }) => setHours(newValue.target.value)}></CronHours>
          <CronMinutes value={minutes} onChange={(newValue: { target: { value: any } }) => setMinutes(newValue.target.value)}></CronMinutes>
        </>
      case 'hour':
        return <>
          <CronMinutes value={minutes} onChange={(newValue: { target: { value: any } }) => setMinutes(newValue.target.value)}></CronMinutes>
        </>
      default:
        return <p>default!!</p>
    }
  }

  return (
    <FormControl fullWidth variant='outlined'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          render={() => (
            <Box
              className={clsx(classes.borderColor, classes.borderRadius)}
              style={{ padding: '1em', marginBottom: '1.5em' }}
            >
              <TypographyBase>{label}</TypographyBase>
              <CronPeriod value={period!!} onChange={(newValue: { target: { value: any } }) => setPeriod(newValue.target.value)}></CronPeriod>
              {switcheando()}
              <p>{period} - {hours} -{minutes}</p>
            </Box>
          )}
        />
      </LocalizationProvider>
    </FormControl>
  )
}
