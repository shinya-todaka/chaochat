import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import UserProvider from 'contexts/UserContext';
import NextApp, { AppContext } from 'next/app';
import firebase from 'firebase/app';
import firebaseConfig from 'firebase-config.json';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from 'plugins/theme';

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
          <CssBaseline />
          <Component {...pageProps} />
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
