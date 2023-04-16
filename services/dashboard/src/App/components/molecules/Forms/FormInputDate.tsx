import React from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { Controller } from 'react-hook-form'

const DATE_FORMAT = 'dd-MM-yy-HH-ss'

type FormInputDatePropsT = {
  name: string;
  control: any;
  label: string;
  setValue?: any;
}

export const FormInputDate: React.FC<FormInputDatePropsT> = ({ name, control, label }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <KeyboardDatePicker
            fullWidth
            variant='inline'
            defaultValue={new Date()}
            id={`date-${Math.random()}`}
            label={label}
            rifmFormatter={(val: string) => val.replace(/[^[a-zA-Z0-9-]*$]+/gi, '')}
            refuse={/[^[a-zA-Z0-9-]*$]+/gi}
            autoOk
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            format={DATE_FORMAT}
            {...field}
          />
        )}
      />
    </MuiPickersUtilsProvider>
  )
}
