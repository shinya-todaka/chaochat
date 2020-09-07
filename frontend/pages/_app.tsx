import type { AppProps } from 'next/app';
import UserProvider from 'contexts/UserContext';
import NextApp, { AppContext } from 'next/app';
import firebase from 'firebase/app';
import firebaseConfig from 'firebase-config.json';

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await NextApp.getInitialProps(context);

  return { ...appProps };
};

export default MyApp;
