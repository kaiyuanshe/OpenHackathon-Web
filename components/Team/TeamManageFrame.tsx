import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCloud,
  faTrophy,
  faUser,
  faUserSecret,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loading } from 'idea-react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { JWTProps, RouteProps } from 'next-ssr-middleware';
import { Fragment, PureComponent } from 'react';
import { Col, Nav } from 'react-bootstrap';

import { activityTeamMenus } from '../../configuration/menu';
import activityStore from '../../models/Activity';
import { Staff } from '../../models/Activity/Staff';
import { ErrorBaseData } from '../../models/Base';
import { i18n } from '../../models/Base/Translation';
import sessionStore from '../../models/User/Session';
import { findDeep } from '../../utils/data';
import { ActivityManageFrameProps } from '../Activity/ActivityManageFrame';
import { MainBreadcrumb } from '../layout/MainBreadcrumb';
import { PageHead } from '../layout/PageHead';

const { t } = i18n;

library.add(faTrophy, faUser, faUserSecret, faCloud);

export type TeamManageBaseParams = Record<'name' | 'tid', string>;

export type TeamManageBaseProps = RouteProps<TeamManageBaseParams> & JWTProps;

export interface TeamManageFrameProps extends ActivityManageFrameProps {
  tid: string;
}

@observer
export class TeamManageFrame extends PureComponent<TeamManageFrameProps> {
  @observable
  accessor teamMemberRole = '';

  @observable
  accessor isLoading = false;

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

      if (status !== 404) this.teamMemberRole = '';
    } finally {
      this.isLoading = false;
    }
  }

  renderNav() {
    const { name, tid } = this.props,
      { teamMemberRole } = this;

    return (
      <Nav className="flex-column px-2 border-end flex-nowrap" variant="pills">
        {activityTeamMenus().map(({ title, list }) => (
          <Fragment key={title}>
            <Nav.Link className="text-muted d-md-none d-lg-inline" disabled>
              {title}
            </Nav.Link>
            {list?.map(
              ({ title, href, icon = 'home', roles }) =>
                (teamMemberRole === 'admin' ||
                  (teamMemberRole &&
                    roles?.includes(teamMemberRole as Staff['type']))) && (
                  <Nav.Link
                    key={title}
                    href={`/activity/${name}/team/${tid}/manage/${href}`}
                  >
                    <FontAwesomeIcon
                      icon={icon}
                      className="text-primary ms-3 me-3"
                    />
                    <span className="d-md-none d-lg-inline">{title}</span>
                  </Nav.Link>
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
      activityTeamMenus(),
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

    return (
      <div
        className={
          authorized
            ? 'row row-cols-xs-1 row-cols-md-2'
            : 'vh-100 d-flex justify-content-center align-items-center'
        }
      >
        <PageHead title={`${title} - ${tid} - ${name} ${t('team_manage')}`} />

        {isLoading ? (
          <Loading />
        ) : authorized ? (
          <>
            <Col md="auto">{this.renderNav()}</Col>

            <Col className="flex-fill me-4">
              <MainBreadcrumb currentRoute={currentRoute} />
              <div className="mt-3">{children}</div>
            </Col>
          </>
        ) : (
          <div className="display-3">{t('no_permission')}</div>
        )}
      </div>
    );
  }
}
