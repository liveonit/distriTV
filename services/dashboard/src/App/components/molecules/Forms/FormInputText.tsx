import React from 'react'
import { Control, Controller } from 'react-hook-form'
import {TextField, TextFieldProps} from '@material-ui/core'

type FormInputPropsT = {
  name: string;
  control: Control<any, any>
  label: string;
  setValue?: any;
} & TextFieldProps

export const FormInputText = ({ name, control, ...otherProps }: FormInputPropsT) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          {...otherProps}
          helperText={error ? error.message : null}
          error={!!error}
          onChange={onChange}
          value={value}
        />
      )}
    />
  )
}
