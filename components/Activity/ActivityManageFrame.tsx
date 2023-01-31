import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBullhorn,
  faCloud,
  faDesktop,
  faEdit,
  faMessage,
  faPeopleGroup,
  faSitemap,
  faStar,
  faThLarge,
  faTrophy,
  faUser,
  faUserSecret,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Fragment, PureComponent } from 'react';
import { Container, Nav } from 'react-bootstrap';

import { menus } from '../../configuration/menu';
import activityStore from '../../models/Activity';
import sessionStore from '../../models/Session';
import { i18n } from '../../models/Translation';
import { findDeep } from '../../utils/data';
import { MainBreadcrumb } from '../MainBreadcrumb';
import PageHead from '../PageHead';
import { PlatformAdminFrameProps } from '../PlatformAdmin/PlatformAdminFrame';
import { SessionBox } from '../User/SessionBox';

const { t } = i18n;

library.add(
  faBullhorn,
  faCloud,
  faDesktop,
  faEdit,
  faMessage,
  faPeopleGroup,
  faSitemap,
  faStar,
  faThLarge,
  faTrophy,
  faUser,
  faUserSecret,
);

export interface ActivityManageFrameProps extends PlatformAdminFrameProps {
  name: string;
}

@observer
export class ActivityManageFrame extends PureComponent<ActivityManageFrameProps> {
  async componentDidMount() {
    await activityStore.getOne(this.props.name);

    if (!activityStore.currentOne.roles) sessionStore.signOut();
  }

  get currentRoute() {
    const { path = '' } = this.props;

    return findDeep(
      menus(),
      'list',
      ({ href }) => !!href && path.endsWith(href),
    );
  }

  @computed
  get authorized() {
    const { roles: role } = activityStore.currentOne,
      { currentRoute } = this;

    return (
      role?.isAdmin ||
      (role?.isJudge && currentRoute.at(-1)?.roles?.includes('judge'))
    );
  }

  renderNav() {
    const { name } = this.props,
      { roles: role } = activityStore.currentOne;

    return (
      <Nav className="h-100 flex-column px-2 border-end" variant="pills">
        {menus().map(({ title, list }) => (
          <Fragment key={title}>
            <Nav.Link className="text-muted d-md-none d-lg-inline" disabled>
              {title}
            </Nav.Link>
            {list?.map(({ title, href, icon = 'home', roles }) => {
              const path = `/activity/${name}/manage/${href}`;
              const active = location.pathname === path;

              return (
                (role?.isAdmin || roles?.includes('judge')) && (
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
                    <span className="d-md-none d-lg-inline">{title}</span>
                  </Nav.Link>
                )
              );
            })}
          </Fragment>
        ))}
      </Nav>
    );
  }

  render() {
    const { authorized, currentRoute } = this,
      { children, name, title } = this.props;

    return (
      <SessionBox
        auto
        className="d-flex justify-content-center align-items-center"
        style={{ height: 'calc(100vh - 3.5rem)' }}
      >
        <PageHead title={`${title} - ${name} ${t('activity_manage')}`} />

        {authorized ? (
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
