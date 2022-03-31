import type { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/globals.less';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainNavigation />

      <div className="mt-5 pt-2">
        <Component {...pageProps} />
      </div>


    </>
  );
}
