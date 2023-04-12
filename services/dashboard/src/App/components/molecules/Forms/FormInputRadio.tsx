import React from 'react'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, RadioGroupProps } from '@material-ui/core'
import { Control, Controller } from 'react-hook-form'

type FormInputRadioPropsT = {
  name: string
  control: Control<any, any>
  label: string
  setValue?: any
  radioGroupOptions: { value: string | number; label: string }[]
} & RadioGroupProps


export const FormInputRadio: React.FC<FormInputRadioPropsT> = ({ name, control, label, radioGroupOptions, ...otherProps }) => {
  const generateRadioOptions = () => {
    return radioGroupOptions.map((singleOption) => (
      <FormControlLabel value={singleOption.value} label={singleOption.label} control={<Radio />} />
    ))
  }

  return (
    <FormControl component='fieldset'>
      <FormLabel component='legend'>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <RadioGroup {...otherProps} value={value} onChange={onChange}>
            {generateRadioOptions()}
          </RadioGroup>
        )}
      />
    </FormControl>
  )
}
