import { MenuItem, Select } from '@material-ui/core';
import React from 'react';
interface SearchDropdownProps {
  options: string[];
  value: string;
  onChange: (event: string) => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({ options, value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValues = event.target.value as string;
    onChange(selectedValues);
  };

  return (
    <Select 
      value={value} 
      onChange={handleChange} 
      variant='outlined'
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
  );
};

export default SearchDropdown;
