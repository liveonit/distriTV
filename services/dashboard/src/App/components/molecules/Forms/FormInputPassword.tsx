import React, { useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { TextField, TextFieldProps } from '@material-ui/core'
import { VisibilityOff, Visibility } from '@material-ui/icons'
import { InputAdornment, IconButton } from '@mui/material'

type FormPasswordPropsT = {
  name: string
  control: Control<any, any>
  label: string
  setValue?: any
} & TextFieldProps

export const FormInputPassword = ({ name, control, ...otherProps }: FormPasswordPropsT) => {
  const [showPassword, setShowPassword] = useState(false)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

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
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  )
}
