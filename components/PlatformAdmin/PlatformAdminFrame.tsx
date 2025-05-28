import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBullhorn,
  faDesktop,
  faEdit,
  faPeopleGroup,
  faSitemap,
  faStar,
  faThLarge,
  faTrophy,
  faUpload,
  faUser,
  faUserSecret,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { Fragment, PropsWithChildren } from 'react';
import { Container, Nav } from 'react-bootstrap';

import { adminMenus } from '../../configuration/menu';
import { i18n, I18nContext } from '../../models/Base/Translation';
import sessionStore from '../../models/User/Session';
import { findDeep } from '../../utils/data';
import { MainBreadcrumb } from '../layout/MainBreadcrumb';
import { PageHead } from '../layout/PageHead';

library.add(
  faEdit,
  faUser,
  faUserSecret,
  faPeopleGroup,
  faTrophy,
  faStar,
  faSitemap,
  faBullhorn,
  faUpload,
  faThLarge,
  faDesktop,
);

export type PlatformAdminFrameProps = PropsWithChildren<{
  title: string;
  path?: string;
}>;

@observer
export class PlatformAdminFrame extends ObservedComponent<PlatformAdminFrameProps, typeof i18n> {
  static contextType = I18nContext;

  componentDidMount() {
    sessionStore.getProfile();
  }

  get currentRoute() {
    const i18n = this.observedContext,
      { path = '' } = this.props;

    return findDeep(adminMenus(i18n), 'list', ({ href }) => !!href && path.endsWith(href));
  }

  renderNav() {
    const i18n = this.observedContext;

    return (
      <Nav className="h-100 flex-column px-2 border-end flex-nowrap" variant="pills">
        {adminMenus(i18n).map(({ title, list }) => (
          <Fragment key={title}>
            <Nav.Link className="text-muted d-none d-lg-inline" disabled>
              {title}
            </Nav.Link>
            {list?.map(({ title, href, icon = 'home' }) => {
              const path = `/admin/${href === '/' ? '' : href}`;
              const active = globalThis.location?.pathname === path;

              return (
                <Nav.Link key={title} className="text-nowrap" href={path} active={active}>
                  <FontAwesomeIcon
                    className="ms-3 me-3"
                    icon={icon}
                    color={active ? 'white' : 'primary'}
                  />
                  <span className="d-none d-lg-inline">{title}</span>
                </Nav.Link>
              );
            })}
          </Fragment>
        ))}
      </Nav>
    );
  }

  render() {
    const { t } = this.observedContext,
      { currentRoute } = this,
      { children, title } = this.props,
      { downloading, isPlatformAdmin } = sessionStore;

    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: 'calc(100vh - 3.5rem)' }}
      >
        <PageHead title={`${title} - ${t('platform_management')}`} />

        {downloading > 0 ? (
          <Loading />
        ) : isPlatformAdmin ? (
          <>
            {this.renderNav()}

            <main className="h-100 flex-fill ms-3 overflow-auto">
              <MainBreadcrumb currentRoute={currentRoute} />
              <Container className="mt-3 py-3">{children}</Container>
            </main>
          </>
        ) : (
          <div className="display-3">{t('no_permission')}</div>
        )}
      </div>
    );
  }
}
