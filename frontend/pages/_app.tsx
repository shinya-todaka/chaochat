import React, { useEffect } from 'react';
import NextApp, { AppProps, AppContext } from 'next/app';
import UserProvider from 'contexts/UserContext';
import firebase from 'firebase/app';
import firebaseConfig from 'firebase-config.json';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from 'plugins/theme';
import AppBar from 'components/common/header/AppBar';
import SnackbarProvider from 'contexts/SnackBarContext';
import TextFieldDialogProvider from 'contexts/TextFieldDialogContext';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <TextFieldDialogProvider>
              <Box bgcolor="#dcdcdc">
                <CssBaseline />
                <Container maxWidth="sm" disableGutters>
                  <Box bgcolor="white" width="100%" height="100vh">
                    <AppBar />
                    <Component {...pageProps} />
                  </Box>
                </Container>
              </Box>
            </TextFieldDialogProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </UserProvider>
    </>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await NextApp.getInitialProps(context);

  return { ...appProps };
};

export default MyApp;
