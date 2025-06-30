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
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          // Style áp dụng cho toàn bộ DataGrid
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within':
            {
              outline: 'none',
            },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f3f4f6',
            color: 'black',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            padding: '4px 6px',
          },
        },
      },
      defaultProps: {
        disableColumnMenu: true,
        disableColumnFilter: true,
        disableColumnSorting: true,
        disableRowSelectionOnClick: true,
      },
    },
  },
};

export default createTheme(theme);
