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
import { makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Fragment, PureComponent } from 'react';
import { Container, Nav } from 'react-bootstrap';

import { adminMenus } from '../../configuration/menu';
import platformAdminStore from '../../models/PlatformAdmin';
import sessionStore from '../../models/Session';
import { i18n } from '../../models/Translation';
import { findDeep } from '../../utils/data';
import { MainBreadcrumb } from '../layout/MainBreadcrumb';
import PageHead from '../layout/PageHead';
import { SessionBox } from '../User/SessionBox';

const { t } = i18n;

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

export interface PlatformAdminFrameProps {
  title: string;
  path?: string;
}

@observer
export class PlatformAdminFrame extends PureComponent<PlatformAdminFrameProps> {
  constructor(props: PlatformAdminFrameProps) {
    super(props);
    makeObservable(this);
  }

  @observable
  loading = false;

  sessionDisposer = reaction(
    () => sessionStore.user,
    user => user && this.componentDidMount(),
  );

  async componentDidMount() {
    this.loading = true;
    await platformAdminStore.checkAuthorization();
    this.loading = false;
  }

  componentWillUnmount() {
    this.sessionDisposer();
  }

  get currentRoute() {
    const { path = '' } = this.props;

    return findDeep(
      adminMenus(),
      'list',
      ({ href }) => !!href && path.endsWith(href),
    );
  }

  renderNav() {
    return (
      <Nav
        className="h-100 flex-column px-2 border-end flex-nowrap"
        variant="pills"
      >
        {adminMenus().map(({ title, list }) => (
          <Fragment key={title}>
            <Nav.Link className="text-muted d-none d-lg-inline" disabled>
              {title}
            </Nav.Link>
            {list?.map(({ title, href, icon = 'home' }) => {
              const path = `/admin/${href === '/' ? '' : href}`;
              const active = globalThis.location?.pathname === path;

              return (
                <Nav.Link
                  key={title}
                  className="text-nowrap"
                  href={path}
                  active={active}
                >
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
    const { currentRoute, loading } = this,
      { children, title } = this.props,
      { isPlatformAdmin } = platformAdminStore;

    return (
      <SessionBox
        auto
        className="d-flex justify-content-center align-items-center"
        style={{ height: 'calc(100vh - 3.5rem)' }}
      >
        <PageHead title={`${title} - ${t('platform_management')}`} />
        {loading ? (
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
      </SessionBox>
    );
  }
}
