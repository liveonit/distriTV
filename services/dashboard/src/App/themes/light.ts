import {createTheme } from '@material-ui/core';

const lightTheme = createTheme({
  palette: {
    type: 'light',
    common: {
      white: '#fff',
    },
    action: {
      active: '#00a096',
    },
    background: {
      default: '#fafafa',
      paper: '#fff',
    },
    primary: {
      light: '#00a096',
      main: '#00a096',
      dark: '#00796B',
      contrastText: '#fff',
    },
    secondary: {
      light: '#B2DFDB',
      main: '#00a096',
      dark: '#00695C',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
    
   
  },
  
  overrides: {},
});




export default lightTheme;

