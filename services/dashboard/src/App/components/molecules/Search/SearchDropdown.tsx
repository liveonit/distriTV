import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React from 'react';
interface SearchDropdownProps {
  options: string[];
  value: string;
  onChange: (event: string) => void;
  placeholder: string;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({ options, value, onChange, placeholder }) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValues = event.target.value as string;
    onChange(selectedValues);
  };

  return (
    <FormControl variant='outlined'>    
      <InputLabel variant='outlined'>{placeholder}</InputLabel>    
      <Select 
        variant='outlined'
        value={value || ""} 
        onChange={handleChange}
        renderValue={
          value !== "" ? undefined : () => 'pepin'
        }
        style={{minWidth: 200}}>      
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default SearchDropdown;
