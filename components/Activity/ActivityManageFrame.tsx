import Link from 'next/link';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Fragment, PureComponent } from 'react';
import { Nav, Breadcrumb, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
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
} from '@fortawesome/free-solid-svg-icons';

import { findDeep } from '../../utils/data';
import { SessionBox } from '../User/SessionBox';
import { menus } from '../../models/Staff';
import { MenuItem } from '../../models/Staff';
import activityStore from '../../models/Activity';

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
  name: string;
  path?: string;
  menu?: MenuItem[];
}

@observer
export class ActivityManageFrame extends PureComponent<ActivityManageFrameProps> {
  componentDidMount() {
    activityStore.getOne(this.props.name);
  }

  renderNav() {
    const { name, menu = menus } = this.props,
      { roles: role } = activityStore.currentOne;

    return (
      <Nav className="flex-column px-2 border-end" variant="pills">
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
                    <Nav.Link>
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

  get currentRoute() {
    const { path = '' } = this.props;

    return findDeep(menus, 'list', ({ href }) => !!href && path.includes(href));
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

  renderMain() {
    const { children } = this.props,
      { currentRoute } = this;

    return (
      <>
        <Breadcrumb className="p-1 bg-light rounded">
          {currentRoute.map(({ href, title }, index, { length }) => (
            <Breadcrumb.Item
              className="mt-3"
              key={title}
              href={href}
              active={index + 1 === length}
            >
              {title}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <div className="mt-3">{children}</div>
      </>
    );
  }

  render() {
    const { authorized } = this;

    return (
      <SessionBox
        auto
        className={
          authorized
            ? 'row row-cols-xs-1 row-cols-md-2'
            : 'vh-100 d-flex justify-content-center align-items-center'
        }
      >
        {authorized ? (
          <>
            <Col md="auto">{this.renderNav()}</Col>

            <Col className="flex-fill me-4">{this.renderMain()}</Col>
          </>
        ) : (
          <div className="display-3">暂无权限</div>
        )}
      </SessionBox>
    );
  }
}
