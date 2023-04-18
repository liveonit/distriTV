import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { SelectProps } from '@material-ui/core'
import { Control, Controller } from 'react-hook-form'



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      backgroundColor: "primary"
    },
  },
};

type FormInputDropdownCheckPropsT = {
  name: string
  control: Control<any, any>
  label: string
  setValue?: any
  selectOptions: { value: string; label: string }[]
} & SelectProps

export const FormInputDropdownCheck: React.FC<FormInputDropdownCheckPropsT> = ({ name, control, label, selectOptions, ...otherProps }) => {

  const [tagName, setTagName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof tagName>) => {
    const {
      target: { value },
    } = event;
    setTagName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split('-') : value,
    );
  };

  return (
    <div>
      <FormControl fullWidth variant='outlined'>
        <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
      
        <Select 
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={tagName}
          onChange={handleChange}
          input={<OutlinedInput label="Label" />}
          renderValue={(selected) => selected.join('-')}
          MenuProps={MenuProps}

        >
          {selectOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={tagName.indexOf(option.value) > -1} />
              <ListItemText primary={option.label+'-'+option.value} />
            </MenuItem>
          ))}
        </Select>
        
      </FormControl>
      
    </div>
  );
}

