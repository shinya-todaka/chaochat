import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <div style={{ width: '100%', height: '100vh' }}>
    <Component {...pageProps} />
  </div>
);

export default MyApp;
