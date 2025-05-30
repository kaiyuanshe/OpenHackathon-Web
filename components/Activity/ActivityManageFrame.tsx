import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBullhorn,
  faCloud,
  faDesktop,
  faEdit,
  faFilePen,
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
import { StaffType } from '@kaiyuanshe/openhackathon-service';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { Fragment } from 'react';
import { Container, Nav } from 'react-bootstrap';

import { menus } from '../../configuration/menu';
import activityStore from '../../models/Activity';
import { i18n, I18nContext } from '../../models/Base/Translation';
import { findDeep } from '../../utils/data';
import { MainBreadcrumb } from '../layout/MainBreadcrumb';
import { PageHead } from '../layout/PageHead';
import { PlatformAdminFrameProps } from '../PlatformAdmin/PlatformAdminFrame';

library.add(
  faBullhorn,
  faCloud,
  faDesktop,
  faEdit,
  faFilePen,
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
export class ActivityManageFrame extends ObservedComponent<ActivityManageFrameProps, typeof i18n> {
  static contextType = I18nContext;

  componentDidMount() {
    activityStore.getOne(this.props.name);
  }

  get currentRoute() {
    const i18n = this.observedContext,
      { path = '', name } = this.props;

    const breadcrumbRoute = findDeep(
      menus(i18n),
      'list',
      ({ href }) => !!href && path.endsWith(href),
    );

    return breadcrumbRoute.map(v =>
      v.href ? { ...v, href: `/activity/${name}/manage/${v.href}` } : v,
    );
  }

  @computed
  get authorized() {
    const { roles: role } = activityStore.currentOne,
      { currentRoute } = this;

    return (
      role?.isAdmin ||
      (role?.isJudge && currentRoute.at(-1)?.roles?.includes('judge' as StaffType.Judge))
    );
  }

  renderNav() {
    const i18n = this.observedContext,
      { name } = this.observedProps,
      { roles: role } = activityStore.currentOne;

    return (
      <Nav className="h-100 flex-column px-2 border-end flex-nowrap" variant="pills">
        {menus(i18n).map(({ title, list }) => (
          <Fragment key={title}>
            <Nav.Link className="text-muted d-md-none d-lg-inline" disabled>
              {title}
            </Nav.Link>
            {list?.map(({ title, href, icon = 'home', roles }) => {
              const path = `/activity/${name}/manage/${href}`;
              const active = location.pathname === path;

              return (
                (role?.isAdmin || roles?.includes('judge' as StaffType.Judge)) && (
                  <Nav.Link key={title} className="text-nowrap" href={path} active={active}>
                    <FontAwesomeIcon
                      className="mx-3"
                      style={{ height: '1rem', width: '1rem' }}
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
    const { t } = this.observedContext,
      { authorized, currentRoute } = this,
      { children, name, title } = this.props;

    return (
      <div
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
      </div>
    );
  }
}
