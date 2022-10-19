import '../styles/globals.less';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Image } from 'react-bootstrap';

import { MainNavigation } from '../components/layout/MainNavigation';

export default function MyApp({
  router: { pathname },
  Component,
  pageProps,
}: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainNavigation />

      <div className="mt-5 pt-2">
        <Component {...pageProps} />
      </div>

      {!/manage|admin/.test(pathname) && (
        <footer className="flex-fill d-flex justify-content-center align-items-center border-top py-4">
          <a
            className="flex-fill d-flex justify-content-center align-items-center"
            href="https://github.com/idea2app/Next-Bootstrap-ts"
            target="_blank"
            rel="noopener noreferrer"
          >
            由
            <span className="mx-2">
              <Image src="/nextjs.png" alt="Next Logo" width={48} />
            </span>
            idea2app 脚手架强力驱动
          </a>
        </footer>
      )}
    </>
  );
}
