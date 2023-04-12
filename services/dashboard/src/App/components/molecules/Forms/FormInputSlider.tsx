import React, { useEffect } from 'react'
import { FormLabel, Slider, SliderProps } from '@material-ui/core'
import { Control, Controller } from 'react-hook-form'

type FormInputSliderPropsT = {
  name: string
  control: Control<any, any>
  label: string
  setValue?: any
} & SliderProps


export const FormInputSlider: React.FC<FormInputSliderPropsT> = ({ name, control, setValue, label, ...otherProps }) => {
  const [sliderValue, setSliderValue] = React.useState<number>(30)

  useEffect(() => {
    if (sliderValue) setValue(name, sliderValue)
  }, [sliderValue])

  const handleChange = (_event: any, newValue: number | number[]) => {
    setSliderValue(newValue as number)
  }

  return (
    <>
      <FormLabel component='legend'>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={() => (
          <Slider valueLabelDisplay='auto' min={0} max={100} step={1} {...otherProps} onChange={handleChange}  />
        )}
      />
    </>
  )
}
