import '../styles/globals.less';

import { Icon } from 'idea-react';
import { HTTPError } from 'koajax';
import { configure } from 'mobx';
import { enableStaticRendering, observer } from 'mobx-react';
import App, { AppContext } from 'next/app';
import Head from 'next/head';
import { Col, Container, Image, Row } from 'react-bootstrap';

import { MainNavigation } from '../components/layout/MainNavigation';
import { isServer } from '../configuration';
import {
  createI18nStore,
  I18nContext,
  I18nProps,
  loadSSRLanguage,
} from '../models/Base/Translation';

configure({ enforceActions: 'never' });

enableStaticRendering(isServer());

@observer
export default class CustomApp extends App<I18nProps> {
  static async getInitialProps(context: AppContext) {
    return {
      ...(await App.getInitialProps(context)),
      ...(await loadSSRLanguage(context.ctx)),
    };
  }

  i18nStore = createI18nStore(this.props.language, this.props.languageMap);

  componentDidMount() {
    window.addEventListener('unhandledrejection', ({ reason }) => {
      const { message, response } = reason as HTTPError;
      const { statusText, body } = response || {};

      const tips = body?.message || statusText || message;

      if (tips) alert(tips);
    });
  }

  render() {
    const { Component, pageProps, router } = this.props,
      { t } = this.i18nStore;

    return (
      <I18nContext.Provider value={this.i18nStore}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <MainNavigation />

        <div className="mt-5 pt-2">
          <Component {...pageProps} />
        </div>

        {!/manage|admin/.test(router.pathname) && (
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
      </I18nContext.Provider>
    );
  }
}
