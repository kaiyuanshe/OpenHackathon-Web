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
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { Fragment, PureComponent } from 'react';
import { Nav } from 'react-bootstrap';

import activityStore from '../../models/Activity';
import { menus } from '../../models/Staff';
import { MenuItem } from '../../models/Staff';
import { findDeep } from '../../utils/data';
import { MainBreadcrumb } from '../MainBreadcrumb';
import PageHead from '../PageHead';
import { SessionBox } from '../User/SessionBox';

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

export interface ActivityManageFrameProps {
  title: string;
  name: string;
  path?: string;
  menu?: MenuItem[];
}

@observer
export class ActivityManageFrame extends PureComponent<ActivityManageFrameProps> {
  componentDidMount() {
    activityStore.getOne(this.props.name);
  }

  get currentRoute() {
    const { path = '' } = this.props;

    return findDeep(menus, 'list', ({ href }) => !!href && path.endsWith(href));
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
    const { name, menu = menus } = this.props,
      { roles: role } = activityStore.currentOne;

    return (
      <Nav className="h-100 flex-column px-2 border-end" variant="pills">
        {menu.map(({ title, list }) => (
          <Fragment key={title}>
            <Nav.Link className="text-muted d-md-none d-lg-inline" disabled>
              {title}
            </Nav.Link>
            {list?.map(
              ({ title, href, icon = 'home', roles }) =>
                (role?.isAdmin || roles?.includes('judge')) && (
                  <Link
                    key={title}
                    href={`/activity/${name}/manage/${href}`}
                    passHref
                  >
                    <Nav.Link className="text-nowrap">
                      <FontAwesomeIcon
                        icon={icon}
                        className="text-primary ms-3 me-3"
                      />
                      <span className="d-md-none d-lg-inline">{title}</span>
                    </Nav.Link>
                  </Link>
                ),
            )}
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
        <PageHead title={`${title} - ${name} 活动管理`} />

        {authorized ? (
          <>
            {this.renderNav()}

            <main className="h-100 flex-fill ms-3 overflow-auto">
              <MainBreadcrumb currentRoute={currentRoute} />
              <div className="mt-3">{children}</div>
            </main>
          </>
        ) : (
          <div className="display-3">暂无权限</div>
        )}
      </SessionBox>
    );
  }
}
