import { createTheme } from '@material-ui/core';

const lightTheme = createTheme({
  palette: {
    type: 'dark',
    common: {
      black: '#000',
      white: '#fff',
    },
    background: {
      default: '#121212',
      paper: '#424242',
    },
    primary: {
      light: '#333',
      main: '#4DB6AC',
      dark: '#26A69A',
      contrastText: '#fff',
    },
    secondary: {
      light: '#A7FFEB',
      main: '#4DB6AC',
      dark: '#00796B',
      contrastText: '#fff',
    },
    text: {
      primary: '#fff',
      secondary: '#fff',
      disabled: 'rgba(255, 255, 255, 0.5)',
      hint: 'rgba(255, 255, 255, 0.5)',
    },
  },
  overrides: {},
});

export default lightTheme;
