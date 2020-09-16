import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const originalTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#CC3C81',
    },
    secondary: {
      main: '#EC76B6',
      light: '#ffad',
    },
    text: {
      primary: '#000',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});
const theme = responsiveFontSizes(originalTheme);
export default theme;
