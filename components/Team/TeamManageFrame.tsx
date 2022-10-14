import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { computed, observable } from 'mobx';
import Link from 'next/link';
import { Fragment, PureComponent } from 'react';
import { Col, Nav } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTrophy,
  faUser,
  faUserSecret,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ActivityManageFrameProps } from '../Activity/ActivityManageFrame';
import PageHead from '../PageHead';
import { MainBreadcrumb } from '../MainBreadcrumb';
import activityStore from '../../models/Activity';
import { ErrorBaseData } from '../../models/Base';
import sessionStore from '../../models/Session';
import { activityTeamMenus, Staff } from '../../models/Staff';
import { SessionBox } from '../User/SessionBox';
import { findDeep } from '../../utils/data';

library.add(faTrophy, faUser, faUserSecret);

export interface TeamManageFrameProps extends ActivityManageFrameProps {
  tid: string;
}

@observer
export class TeamManageFrame extends PureComponent<TeamManageFrameProps> {
  @observable
  teamMemberRole = '';

  @observable
  isLoading = false;

  async componentDidMount() {
    const { name, tid } = this.props,
      { user } = sessionStore;

    try {
      this.isLoading = true;
      const currentUserInThisTeam =
        user?.id &&
        (await activityStore.teamOf(name).memberOf(tid).getOne(user.id));
      this.teamMemberRole = currentUserInThisTeam
        ? currentUserInThisTeam.role
        : '';
    } catch (error: any) {
      const { status } = error as ErrorBaseData;
      if (status !== 404) {
        this.teamMemberRole = '';
      }
    } finally {
      this.isLoading = false;
    }
  }

  renderNav() {
    const { name, menu = activityTeamMenus, tid } = this.props,
      { teamMemberRole } = this;

    return (
      <Nav className="flex-column px-2 border-end" variant="pills">
        {menu.map(({ title, list }) => (
          <Fragment key={title}>
            <Nav.Link className="text-muted d-md-none d-lg-inline" disabled>
              {title}
            </Nav.Link>
            {list?.map(
              ({ title, href, icon = 'home', roles }) =>
                (teamMemberRole === 'admin' ||
                  (teamMemberRole &&
                    roles?.includes(teamMemberRole as Staff['type']))) && (
                  <Link
                    key={title}
                    href={`/activity/${name}/team/${tid}/manage/${href}`}
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

    return findDeep(
      activityTeamMenus,
      'list',
      ({ href }) => !!href && path.includes(href),
    );
  }

  @computed
  get authorized() {
    const { teamMemberRole, currentRoute } = this;

    return (
      teamMemberRole === 'admin' ||
      (teamMemberRole === 'menber' &&
        currentRoute.at(-1)?.roles?.includes('member'))
    );
  }

  render() {
    const { authorized, currentRoute, isLoading } = this,
      { children, name, title, tid } = this.props;

    return isLoading ? (
      <Loading />
    ) : (
      <SessionBox
        auto
        className={
          authorized
            ? 'row row-cols-xs-1 row-cols-md-2'
            : 'vh-100 d-flex justify-content-center align-items-center'
        }
      >
        <PageHead title={`${title} - ${tid} - ${name} 团队管理`} />

        {authorized ? (
          <>
            <Col md="auto">{this.renderNav()}</Col>

            <Col className="flex-fill me-4">
              <MainBreadcrumb currentRoute={currentRoute} />
              <div className="mt-3">{children}</div>
            </Col>
          </>
        ) : (
          <div className="display-3">暂无权限</div>
        )}
      </SessionBox>
    );
  }
}
