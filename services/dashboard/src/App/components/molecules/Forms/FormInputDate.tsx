import React from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { format } from 'date-fns'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { Controller } from 'react-hook-form'

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss'

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
            placeholder={DATE_FORMAT}
            defaultValue={format((new Date()),DATE_FORMAT)}
            id={`date-${Math.random()}`}
            label={label}
            rifmFormatter={(val: string) => val.replace(/[^[a-zA-Z0-9-]*$]+/gi, '')}
            refuse={/[^[a-zA-Z0-9-]*$]+/gi}
            autoOk
            disablePast={true}
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



