import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Layout } from '../components/layout/Layout';
import '../styles/globals.less';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        {/* @ts-ignore */}
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
