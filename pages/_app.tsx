import '../styles/globals.less';

import { HTTPError } from 'koajax';
import { configure } from 'mobx';
import { enableStaticRendering, observer } from 'mobx-react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { Image } from 'react-bootstrap';

import { MainNavigation } from '../components/layout/MainNavigation';
import { ErrorBaseData, isServer } from '../models/Base';
import { i18n } from '../models/Base/Translation';

configure({ enforceActions: 'never' });

enableStaticRendering(isServer());

const { t } = i18n;

globalThis.addEventListener?.('unhandledrejection', ({ reason }) => {
  const { message, body } = (reason || {}) as HTTPError<ErrorBaseData>;

  const tips = body?.detail || message;

  if (tips) alert(tips);
});

const MyApp: FC<AppProps> = observer(
  ({ router: { pathname }, Component, pageProps }) => (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainNavigation />

      <div className="mt-5 pt-2">
        <Component {...pageProps} />
      </div>

      {!/manage|admin/.test(pathname) && (
        <footer className="d-flex justify-content-center align-items-center border-top py-4">
          <a
            href="https://github.com/idea2app/Next-Bootstrap-ts"
            target="_blank"
            rel="noreferrer"
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
