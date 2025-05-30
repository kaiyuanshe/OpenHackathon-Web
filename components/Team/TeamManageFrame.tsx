import { library } from '@fortawesome/fontawesome-svg-core';
import { faCloud, faTrophy, faUser, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StaffType, TeamMemberRole } from '@kaiyuanshe/openhackathon-service';
import { Loading } from 'idea-react';
import { HTTPError } from 'koajax';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { JWTProps, RouteProps } from 'next-ssr-middleware';
import { Fragment } from 'react';
import { Col, Nav } from 'react-bootstrap';

import { activityTeamMenus } from '../../configuration/menu';
import activityStore from '../../models/Activity';
import { i18n, I18nContext } from '../../models/Base/Translation';
import sessionStore from '../../models/User/Session';
import { findDeep } from '../../utils/data';
import { ActivityManageFrameProps } from '../Activity/ActivityManageFrame';
import { MainBreadcrumb } from '../layout/MainBreadcrumb';
import { PageHead } from '../layout/PageHead';

library.add(faTrophy, faUser, faUserSecret, faCloud);

export type TeamManageBaseParams = Record<'name' | 'tid', string>;

export type TeamManageBaseProps = RouteProps<TeamManageBaseParams> & JWTProps;

export interface TeamManageFrameProps extends ActivityManageFrameProps {
  tid: number;
}

@observer
export class TeamManageFrame extends ObservedComponent<TeamManageFrameProps, typeof i18n> {
  static contextType = I18nContext;

  @observable
  accessor teamMemberRole: TeamMemberRole | undefined;

  @observable
  accessor isLoading = false;

  async componentDidMount() {
    const { name, tid } = this.props,
      { user } = sessionStore;

    try {
      this.isLoading = true;

      const currentUserInThisTeam =
        user?.id && (await activityStore.teamOf(name).memberOf(tid).getOne(user.id));

      this.teamMemberRole = currentUserInThisTeam ? currentUserInThisTeam.role : undefined;
    } catch (error: any) {
      const { status } = (error as HTTPError).response;

      if (status !== 404) this.teamMemberRole = undefined;
    } finally {
      this.isLoading = false;
    }
  }

  renderNav() {
    const i18n = this.observedContext,
      { name, tid } = this.observedProps,
      { teamMemberRole } = this;

    return (
      <Nav className="flex-column px-2 border-end flex-nowrap" variant="pills">
        {activityTeamMenus(i18n).map(({ title, list }) => (
          <Fragment key={title}>
            <Nav.Link className="text-muted d-md-none d-lg-inline" disabled>
              {title}
            </Nav.Link>
            {list?.map(
              ({ title, href, icon = 'home', roles }) =>
                (teamMemberRole === 'admin' ||
                  (teamMemberRole && roles?.includes(teamMemberRole))) && (
                  <Nav.Link key={title} href={`/activity/${name}/team/${tid}/manage/${href}`}>
                    <FontAwesomeIcon icon={icon} className="text-primary ms-3 me-3" />
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
    const i18n = this.observedContext,
      { path = '' } = this.props;

    return findDeep(activityTeamMenus(i18n), 'list', ({ href }) => !!href && path.includes(href));
  }

  @computed
  get authorized() {
    const { teamMemberRole, currentRoute } = this;

    return (
      teamMemberRole === 'admin' ||
      (teamMemberRole === 'member' &&
        currentRoute.at(-1)?.roles?.includes('member' as StaffType.Member))
    );
  }

  render() {
    const { t } = this.observedContext,
      { authorized, currentRoute, isLoading } = this,
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
