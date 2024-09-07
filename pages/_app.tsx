import '../styles/globals.less';

import { Icon } from 'idea-react';
import { HTTPError } from 'koajax';
import { configure } from 'mobx';
import { enableStaticRendering, observer } from 'mobx-react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';

import { MainNavigation } from '../components/layout/MainNavigation';
import { i18n } from '../models/Base/Translation';
import { isServer } from '../models/User/Session';

configure({ enforceActions: 'never' });

enableStaticRendering(isServer());

const { t } = i18n;

globalThis.addEventListener?.('unhandledrejection', ({ reason }) => {
  var { message, response } = reason as HTTPError;
  const { statusText, body } = response || {};

  message = body?.message || message || statusText;

  if (message) alert(message);
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
        <footer className="border-top bg-light text-secondary py-5">
          <Container>
            <Row className="align-items-center small text-center g-2">
              <Col xs={12} sm={11}>
                <Row xs={1} md={2} className="align-items-center">
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
                </Row>
              </Col>
              <Col xs={12} sm={1} className="position-relative">
                <a
                  className="stretched-link"
                  target="_blank"
                  href="https://monitor.kaiyuanshe.cn/status/service"
                  rel="noreferrer"
                >
                  <Icon name="hdd-network" size={1.5} />
                </a>
              </Col>
            </Row>
          </Container>
        </footer>
      )}
    </>
  ),
);
export default MyApp;
