import React from 'react'
import { Control, Controller } from 'react-hook-form'
import {TextField, TextFieldProps} from '@material-ui/core'
import { UseFormRegister } from 'react-hook-form';

type FormInputPropsT = {
  name: string;
  control: Control<any, any>
  label: string;
  register: UseFormRegister<any>
  setValue?: any;
} & TextFieldProps

export const FormInputNumber = ({ name, control, register, ...otherProps }: FormInputPropsT) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          {...otherProps}
          {...register(name, { valueAsNumber: true })}
          helperText={error ? error.message : null}
          error={!!error}
          onChange={onChange}
          value={parseInt(value)}
        />
      )}
    />
  )
}
