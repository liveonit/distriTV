import React, { useEffect, useState } from 'react'
import { Control, Controller, useController} from 'react-hook-form'
import { Box, FormControl } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'

import TypographyBase from '../../../atoms/TypographyBase'
// import { CronPeriodType } from './types'
// import { CronPeriod } from './fields/CronPeriod'
import { CronMinutes } from './fields/CronMinutes'
import { CronHours } from './fields/CronHours'
import { CronWeekDays } from './fields/CronWeekDays'
import { CronDays } from './fields/CronDays'
import { CronMonths } from './fields/CronMonths'
import { Grid } from '@material-ui/core'

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
  const { field } = useController({ name, control })

  const parsedCron = cronToValues(field.value)

  const [months, setMonths] = useState<any>(parsedCron.months)
  const [days, setDays] = useState<any>(parsedCron.days)
  const [weekDays, setWeekDays] = useState<any>(parsedCron.weekDays)
  const [hours, setHours] = useState<any>(parsedCron.hours)
  const [minutes, setMinutes] = useState<any>(parsedCron.minutes)

  useEffect(() => {
    const cronExp = valuesToCron(minutes, hours, days, months, weekDays)
    field.onChange(cronExp)
  }, [minutes, hours, days, months, weekDays])

  return (
    <FormControl fullWidth variant='outlined'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          render={() => (
            <Box
              className={clsx(classes.borderColor, classes.borderRadius)}
              style={{ padding: '1em', marginBottom: '1.0em' }}
            >
              <TypographyBase>{label}</TypographyBase>
              
               
                                       
              
              

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <CronMonths 
                  value={months} 
                  onChange={(newValue: { target: { value: any } }) => {
                    setMonths(newValue.target.value)
                  }}
                /> 
                </Grid>
                <Grid item xs={6}>
                  <CronDays 
                  value={days} 
                  onChange={(newValue: { target: { value: any } }) => {
                    setDays(newValue.target.value)
                    setWeekDays([])
                  }}
                /> 
                </Grid>
                <Grid item xs={12}>
                  <CronWeekDays 
                  value={weekDays} 
                  onChange={(newValue: { target: { value: any } }) => {
                    setWeekDays(newValue.target.value)
                    setDays([])
                  }}
                />
                </Grid>
                <Grid item xs={6}>
                  <CronHours value={hours} onChange={(newValue: { target: { value: any } }) => setHours(newValue.target.value)}></CronHours>
                </Grid>
                <Grid item xs={6}>
                  <CronMinutes value={minutes} onChange={(newValue: { target: { value: any } }) => setMinutes(newValue.target.value)}></CronMinutes>
                </Grid>
              </Grid>
            </Box>
          )}
        />
      </LocalizationProvider>
    </FormControl>
  )
}


const valuesToCron = (minutes: number[], hours: number[], days: number[], months: string[], weekDays: string[]) => {  
  let cronExp = `0 ${minutes.length === 0 ? '*' : minutes.sort().toString()} ${hours.length === 0 ? '*' : hours.sort().toString()} ${days.length === 0 ? weekDays.length > 0 ? '?' : '*' : days.sort().toString()} ${months.length === 0 ? '*' : months.toString()} ${weekDays.length === 0 ? days.length >= 0 ? '?' : '*' : weekDays.sort().toString()}`
  return cronExp
}

const cronToValues = (cronExp: string) => {
  if (cronExp) {
    const splitted = cronExp.split(' ')    
    return {
      minutes: splitted[1] === '*' || splitted[1] === '?' ? [] : splitted[1].split(','),
      hours: splitted[2] === '*' || splitted[2] === '?' ? [] : splitted[2].split(','),
      days: splitted[3] === '*' || splitted[3] === '?' ? [] : splitted[3].split(','),
      months: splitted[4] === '*' || splitted[4] === '?' ? [] : splitted[4].split(','),
      weekDays: splitted[5] === '*' || splitted[5] === '?' ? [] : splitted[5].split(','),      
    }
  } else {
    return {
      minutes:  [],
      hours: [],
      weekDays: [],
      days: [],
      months: []
    }
  }
}