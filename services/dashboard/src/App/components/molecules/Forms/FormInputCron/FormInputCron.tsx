import React, { useEffect, useState } from 'react'
import { Control, Controller, useController} from 'react-hook-form'
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
import { CronWeekDays } from './fields/CronWeekDays'
import { CronDays } from './fields/CronDays'

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
  console.log(parsedCron, 'parseamo')

  const [period, setPeriod] = useState<any>('month')
  const [days, setDays] = useState<any>(parsedCron.days)
  const [weekDays, setWeekDays] = useState<any>(parsedCron.weekDays)
  const [hours, setHours] = useState<any>(parsedCron.hours)
  const [minutes, setMinutes] = useState<any>(parsedCron.minutes)

  useEffect(() => {
    const cronExp = valuesToCron(minutes, hours, weekDays, days)
    console.log(cronExp, 'mostrame', typeof(cronExp))
    field.onChange(cronExp)
  }, [period, minutes, hours, weekDays, days])

  const switcheando = () => {
    switch (period) {
      case 'month':
        return <>
          <CronDays 
            value={days} 
            onChange={(newValue: { target: { value: any } }) => {
              setDays(newValue.target.value)
              setWeekDays([])
            }}
          />                          
          <CronWeekDays 
            value={weekDays} 
            onChange={(newValue: { target: { value: any } }) => {
              setWeekDays(newValue.target.value)
              setDays([])
            }}
          />
          <CronHours value={hours} onChange={(newValue: { target: { value: any } }) => setHours(newValue.target.value)}></CronHours>
          <CronMinutes value={minutes} onChange={(newValue: { target: { value: any } }) => setMinutes(newValue.target.value)}></CronMinutes>
        </>
      case 'week':
        return <>
          <CronWeekDays value={weekDays} onChange={(newValue: { target: { value: any } }) => setWeekDays(newValue.target.value)}></CronWeekDays>
          <CronHours value={hours} onChange={(newValue: { target: { value: any } }) => setHours(newValue.target.value)}></CronHours>
          <CronMinutes value={minutes} onChange={(newValue: { target: { value: any } }) => setMinutes(newValue.target.value)}></CronMinutes>
        </>
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
              <p>{period} - {days.toString()} - {weekDays.toString()} - {hours.toString()} - {minutes.toString()}</p>
            </Box>
          )}
        />
      </LocalizationProvider>
    </FormControl>
  )
}


const valuesToCron = (minutes: number[], hours: number[], weekDays: string[], days: number[]) => {  
  console.log('se metio aca adentro!!!!!', minutes, hours, weekDays, days)
  let cronExp = `0 ${minutes.length === 0 ? '*' : minutes.sort().toString()} ${hours.length === 0 ? '*' : hours.sort().toString()} ${days.length === 0 ? weekDays.length > 0 ? '?' : '*' : days.sort().toString()} * ${weekDays.length === 0 ? days.length > 0 ? '?' : '*' : weekDays.sort().toString()}`
  return cronExp
}

const cronToValues = (cronExp: string) => {
  console.log(cronExp, 'pepepep')
  if (cronExp) {
    const splitted = cronExp.split(' ')    
    return {
      minutes: splitted[1] === '*' || splitted[1] === '?' ? [] : splitted[1].split(','),
      hours: splitted[2] === '*' || splitted[2] === '?' ? [] : splitted[2].split(','),
      weekDays: splitted[5] === '*' || splitted[5] === '?' ? [] : splitted[5].split(','),
      days: splitted[3] === '*' || splitted[3] === '?' ? [] : splitted[3].split(','),
    }
  } else {
    return {
      minutes:  [],
      hours: [],
      weekDays: [],
      days: [],
    }
  }
}