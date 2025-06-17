import { createTheme } from '@mui/material';

export const theme = {
  palette: {
    primary: {
      main: '#337ab7',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },
  typography: {
    fontFamily: ['Roboto Condensed Variable', 'sans-serif'].join(','),
    fontSize: 14,
  },
};

export default createTheme(theme);
