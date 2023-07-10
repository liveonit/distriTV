import React, { useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { Box, FormControl } from '@mui/material'
import { makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { Cron } from 'react-js-cron'
import 'react-js-cron/dist/styles.css'

import TypographyBase from '../../atoms/TypographyBase'

const useStyles = makeStyles((theme: Theme) => ({
  borderColor: {
    border: `1px solid ${theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(206, 203, 203, 0.12)'}`,
  },
  borderRadius: {
    borderRadius: '0.5em',
  },
}))

type FormInputCrontabPropsT = {
  name: string
  control: Control<any, any>
  label: string
  setValue?: any
}

export const FormInputCrontab: React.FC<FormInputCrontabPropsT> = ({ name, control, label }) => {
  const classes = useStyles()

  const [value, setValue] = useState('30 5 * * 1,6')
  return (
    <FormControl fullWidth variant='outlined'>
      <Controller
        name={name}
        control={control}
        render={() => (
          <Box
            className={clsx(classes.borderColor, classes.borderRadius)}
            style={{ padding: '1em', marginBottom: '1.5em' }}
          >
            <TypographyBase>{label}</TypographyBase>
            {/* <DemoContainer components={['DesktopDatePicker', 'DesktopTimePicker']}> */}
              <Cron value={value} setValue={setValue} />
            {/* </DemoContainer> */}
          </Box>
        )}
      />
    </FormControl>
  )
}
