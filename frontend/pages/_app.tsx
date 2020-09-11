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
              <CssBaseline />
              <AppBar />
              <Component {...pageProps} />
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
