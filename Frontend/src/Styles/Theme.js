// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2', // Blue
    },
    secondary: {
      main: '#50E3C2', // Teal
    },
    success: {
      main: '#4CAF50', // Green
    },
    info: {
      main: '#2196F3', // Blue
    },
    action: {
      main: '#9E9E9E', // Gray
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
});

export default theme;
