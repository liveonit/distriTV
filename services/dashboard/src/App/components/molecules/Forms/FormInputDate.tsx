import React from 'react'
import { Control, Controller, useController } from 'react-hook-form'
import { Box, FormControl } from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import dayjs, { Dayjs } from 'dayjs'

import TypographyBase from '../../atoms/TypographyBase'

const useStyles = makeStyles((theme: Theme) => ({
  borderColor: {
    border: `1px solid ${theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(206, 203, 203, 0.12)'}`,
  },
  borderRadius: {
    borderRadius: '0.5em',
  },
}))

type FormInputDatePropsT = {
  name: string
  control: Control<any, any>
  label: string
  setValue?: any
}

export const FormInputDate: React.FC<FormInputDatePropsT> = ({ name, control, label }) => {
  const classes = useStyles()
  const { field } = useController({ name, control })

  const [date, setDate] = React.useState<Dayjs>(dayjs(field.value))
  const [time, setTime] = React.useState<Dayjs>(dayjs(field.value))

  React.useEffect(() => {
    const dateTimeString = `${dayjs(date).format('YYYY-MM-DD')}T${dayjs(time).format('HH:mm:ss')}`
    console.log({ dateTimeString })
    const dateTime = new Date(dateTimeString)
    console.log(dateTime)
    field.onChange(dateTime)
  }, [date, time])

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
              <DemoContainer components={['DesktopDatePicker', 'DesktopTimePicker']}>
                <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
                  <DesktopDatePicker
                    label='Basic date picker'
                    onChange={(newValue) => newValue && setDate(newValue)}
                    value={date}
                  />
                </div>
                <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
                  <DesktopTimePicker
                    label={label}
                    value={time}
                    onChange={(newValue) => newValue && setTime(newValue)}
                  />
                </div>
              </DemoContainer>
            </Box>
          )}
        />
      </LocalizationProvider>
    </FormControl>
  )
}
