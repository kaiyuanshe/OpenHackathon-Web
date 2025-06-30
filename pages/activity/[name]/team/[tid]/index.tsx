import { Hackathon, Team, TeamMember, TeamWork } from '@kaiyuanshe/openhackathon-service';
import { Icon } from 'idea-react';
import { HTTPError } from 'koajax';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { ScrollList } from 'mobx-restful-table';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FormEvent } from 'react';
import { Button, Card, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { CommentBox } from '../../../../../components/CommentBox';
import { MainBreadcrumb } from '../../../../../components/layout/MainBreadcrumb';
import { PageHead } from '../../../../../components/layout/PageHead';
import { EvaluationForm } from '../../../../../components/Team/EvaluationForm';
import { JoinTeamModal } from '../../../../../components/Team/JoinTeamModal';
import { TeamMemberListLayout } from '../../../../../components/Team/TeamMemberList';
import { TeamWorkList } from '../../../../../components/Team/TeamWorkList';
import { isServer } from '../../../../../configuration';
import activityStore, { ActivityModel } from '../../../../../models/Activity';
import { i18n, I18nContext } from '../../../../../models/Base/Translation';
import sessionStore from '../../../../../models/User/Session';

interface TeamPageProps {
  activity: Hackathon;
  team: Team;
  teamMemberList: TeamMember[];
  teamWorkList: TeamWork[];
}

export const getServerSideProps = compose<Partial<Record<'name' | 'tid', string>>, TeamPageProps>(
  cache(),
  errorLogger,
  async ({ params: { name = '', tid = '' } = {} }) => {
    const activityStore = new ActivityModel();

    const activity = await activityStore.getOne(name);

    const { currentTeam } = activityStore;

    const team = await currentTeam!.getOne(+tid);

    const teamMemberList = await currentTeam!.currentMember!.getList(),
      teamWorkList = await currentTeam!.currentWork!.getList();

    return { props: { activity, team, teamMemberList, teamWorkList } };
  },
);

@observer
export default class TeamPage extends ObservedComponent<TeamPageProps, typeof i18n> {
  static contextType = I18nContext;

  store = activityStore.teamOf(this.props.activity.name).memberOf(this.props.team.id);

  @observable
  accessor currentUserInThisTeam: TeamMember | undefined;

  @observable
  accessor teamMemberRole = '';

  @observable
  accessor isShowJoinReqModal = false;

  @computed
  get currentRoute() {
    const {
      activity: { name, displayName: hackathonDisplayName },
      team: { displayName },
    } = this.observedProps;

    return [{ title: hackathonDisplayName, href: `/activity/${name}` }, { title: displayName }];
  }

  @computed
  get isShowJoinTeamBtn() {
    const now = Date.now(),
      { eventStartedAt, eventEndedAt } = this.observedProps.activity,
      { currentEnrollment, currentTeam } = activityStore;

    return (
      now > +new Date(eventStartedAt) &&
      now < +new Date(eventEndedAt) &&
      currentEnrollment?.sessionOne?.status === 'approved' &&
      !currentTeam?.sessionOne
    );
  }

  @computed
  get isShowLeaveTeamBtn() {
    return activityStore.currentTeam?.sessionOne?.id === this.observedProps.team.id;
  }

  @computed
  get evaluatable() {
    const now = Date.now(),
      { judgeStartedAt, judgeEndedAt } = this.observedProps.activity;

    return +new Date(judgeStartedAt) <= now && now <= +new Date(judgeEndedAt);
  }

  async componentDidMount() {
    if (isServer()) return;

    const { name } = this.props.activity,
      { user } = sessionStore;

    try {
      // eslint-disable-next-line no-var
      var { status } = await activityStore.enrollmentOf(name).getSessionOne();
    } catch {
      //
    }

    try {
      this.currentUserInThisTeam = user?.id ? await this.store.getOne(user.id) : undefined;

      this.teamMemberRole = this.currentUserInThisTeam?.role || '';
    } catch (error: any) {
      const { status } = (error as HTTPError).response;

      if (status !== 404) this.teamMemberRole = '';
    }
    // @ts-expect-error Type compatibility issue
    if (status === 'approved')
      try {
        await activityStore.teamOf(name).getSessionOne();
      } catch {
        //
      }
  }

  handleJoinTeam = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    await this.store.joinTeam(formToJSON(event.currentTarget));

    this.isShowJoinReqModal = false;
  };

  handleLeaveTeam = async () => {
    const { t } = this.observedContext;
    const operation =
      this.currentUserInThisTeam?.status === 'approved' ? t('leave_team') : t('cancel_application');

    if (!confirm(`${t('please_make_sure')}${operation}`)) return;

    await this.store.leaveTeam();

    alert(`${operation}${t('success')}`);
  };

  render() {
    const { t } = this.observedContext,
      { name, displayName: hackathonDisplayName } = this.props.activity,
      {
        id,
        displayName,
        description,
        createdBy: { avatar },
      } = this.props.team,
      { teamMemberList, teamWorkList } = this.props,
      {
        currentRoute,
        currentUserInThisTeam,
        teamMemberRole,
        isShowJoinReqModal,
        handleJoinTeam,
        isShowJoinTeamBtn,
        isShowLeaveTeamBtn,
        evaluatable,
      } = this;

    return (
      <Container as="main" className="mt-4">
        <PageHead title={`${displayName} - ${hackathonDisplayName}`} />

        <MainBreadcrumb currentRoute={currentRoute} />

        <Row className="mt-4">
          <Col xs={12} sm={4}>
            <Card style={{ minWidth: '15rem' }}>
              <Card.Header className="bg-white">
                <Card.Img
                  variant="top"
                  src={avatar}
                  className="d-block m-auto"
                  style={{ maxWidth: '15rem' }}
                />
                <h1 className="h3 my-2">{displayName}</h1>
                <p className="text-muted">{description}</p>
                {isShowJoinTeamBtn && (
                  <Button className="w-100" onClick={() => (this.isShowJoinReqModal = true)}>
                    {t('join_team')}
                  </Button>
                )}
                {teamMemberRole === 'admin' && (
                  <Button
                    className="w-100 mt-2"
                    href={`/activity/${name}/team/${id}/manage/participant`}
                  >
                    {t('manage_team')}
                  </Button>
                )}
                {isShowLeaveTeamBtn && (
                  <Button className="w-100 mt-2" variant="danger" onClick={this.handleLeaveTeam}>
                    {currentUserInThisTeam?.status === 'approved'
                      ? t('leave_team')
                      : t('cancel_application')}
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                <h2 className="text-dark fw-bold h6">
                  <Icon name="people-fill" /> {t('team_members')}
                </h2>
                <ScrollList
                  translator={i18n}
                  store={this.store}
                  renderList={allItems => <TeamMemberListLayout defaultData={allItems} />}
                  defaultData={teamMemberList}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={8}>
            <Tabs defaultActiveKey="update" id="activity-detail-tabs">
              <Tab className="pt-2" eventKey="update" title={t('latest_news')}>
                <div className="h1 my-5 text-center">{t('no_news_yet')}</div>
              </Tab>
              <Tab eventKey="teamWork" title={t('team_works')} className="pt-2">
                <TeamWorkList
                  activity={name}
                  team={id}
                  defaultData={teamWorkList}
                  controls={!!currentUserInThisTeam}
                />
              </Tab>
            </Tabs>
          </Col>
        </Row>
        {evaluatable && <EvaluationForm activityName={name} teamId={id} />}

        <CommentBox />

        <JoinTeamModal
          show={isShowJoinReqModal}
          onHide={() => (this.isShowJoinReqModal = false)}
          onSubmit={handleJoinTeam}
        />
      </Container>
    );
  }
}
