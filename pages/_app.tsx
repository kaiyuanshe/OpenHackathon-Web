import '../styles/globals.less';

import { HTTPError } from 'koajax';
import { observer, useStaticRendering } from 'mobx-react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Image } from 'react-bootstrap';

import { MainNavigation } from '../components/layout/MainNavigation';
import { ErrorBaseData, isServer } from '../models/Base';
import { i18n } from '../models/Translation';

// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(isServer());

const { t } = i18n;

globalThis.addEventListener?.('unhandledrejection', ({ reason }) => {
  const { message, body } = (reason || {}) as HTTPError<ErrorBaseData>;

  const tips = body?.detail || message;

  if (tips) alert(tips);
});

const MyApp = observer(
  ({ router: { pathname }, Component, pageProps }: AppProps) => (
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
            {t('powered_by')}
            <span className="mx-2">
              <Image src="/nextjs.png" alt="Next Logo" width={48} />
            </span>
            {t('idea2app_scaffolding')}
          </a>
        </footer>
      )}
    </>
  ),
);
export default MyApp;
