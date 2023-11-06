import { Icon } from 'idea-react';
import { computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { observePropsState } from 'mobx-react-helper';
import { ScrollList } from 'mobx-restful-table';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { FormEvent, PureComponent } from 'react';
import { Button, Card, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { CommentBox } from '../../../../../components/CommentBox';
import { MainBreadcrumb } from '../../../../../components/layout/MainBreadcrumb';
import { PageHead } from '../../../../../components/layout/PageHead';
import { JoinTeamModal } from '../../../../../components/Team/JoinTeamModal';
import { TeamMemberListLayout } from '../../../../../components/Team/TeamMemberList';
import { TeamWorkList } from '../../../../../components/Team/TeamWorkList';
import activityStore, {
  Activity,
  ActivityModel,
} from '../../../../../models/Activity';
import {
  MembershipStatus,
  Team,
  TeamMember,
  TeamWork,
} from '../../../../../models/Activity/Team';
import { ErrorBaseData, isServer } from '../../../../../models/Base';
import { i18n } from '../../../../../models/Base/Translation';
import sessionStore from '../../../../../models/User/Session';

const { t } = i18n;

interface TeamPageProps {
  activity: Activity;
  team: Team;
  teamMemberList: TeamMember[];
  teamWorkList: TeamWork[];
}

export const getServerSideProps = compose<
  Partial<Record<'name' | 'tid', string>>,
  TeamPageProps
>(
  cache(),
  errorLogger,
  translator(i18n),
  async ({ params: { name = '', tid = '' } = {} }) => {
    const activityStore = new ActivityModel();

    const activity = await activityStore.getOne(name);

    const { currentTeam } = activityStore;

    const team = await currentTeam!.getOne(tid);

    const teamMemberList = await currentTeam!.currentMember!.getList(),
      teamWorkList = await currentTeam!.currentWork!.getList();

    return {
      props: { activity, team, teamMemberList, teamWorkList },
    };
  },
);

@observer
@observePropsState
export default class TeamPage extends PureComponent<TeamPageProps> {
  constructor(props: TeamPageProps) {
    super(props);
    makeObservable(this);
  }

  declare observedProps: TeamPageProps;

  store = activityStore
    .teamOf(this.props.activity.name)
    .memberOf(this.props.team.id);

  @observable
  currentUserInThisTeam?: TeamMember = undefined;

  @observable
  teamMemberRole = '';

  @observable
  isShowJoinReqModal = false;

  @computed
  get currentRoute() {
    const {
      activity: { displayName: hackathonDisplayName },
      team: { hackathonName, displayName },
    } = this.observedProps;

    return [
      {
        title: hackathonDisplayName,
        href: `/activity/${hackathonName}`,
      },
      { title: displayName },
    ];
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
    return (
      activityStore.currentTeam?.sessionOne?.id === this.observedProps.team.id
    );
  }

  async componentDidMount() {
    if (isServer()) return;

    const { name } = this.props.activity,
      { user } = sessionStore;

    try {
      var { status } = await activityStore.enrollmentOf(name).getSessionOne();
    } catch {}

    try {
      this.currentUserInThisTeam = user?.id
        ? await this.store.getOne(user.id)
        : undefined;
      this.teamMemberRole = this.currentUserInThisTeam?.role || '';
    } catch (error: any) {
      const { status } = error as ErrorBaseData;

      if (status !== 404) this.teamMemberRole = '';
    }
    // @ts-ignore
    if (status === 'approved')
      try {
        await activityStore.teamOf(name).getSessionOne();
      } catch {}
  }

  handleJoinTeam = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    await this.store.joinTeam(formToJSON(event.currentTarget));

    this.isShowJoinReqModal = false;
  };

  handleLeaveTeam = async () => {
    const operation =
      this.currentUserInThisTeam?.status === MembershipStatus.APPROVED
        ? t('leave_team')
        : t('cancel_application');

    if (!confirm(`${t('please_make_sure')}${operation}`)) return;

    await this.store.leaveTeam();

    alert(`${operation}${t('success')}`);
  };

  render() {
    const hackathonDisplayName = this.props.activity.displayName,
      {
        id,
        hackathonName,
        displayName,
        description,
        creator: { photo },
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
                  src={photo}
                  className="d-block m-auto"
                  style={{ maxWidth: '15rem' }}
                />
                <h1 className="h3 my-2">{displayName}</h1>
                <p className="text-muted">{description}</p>
                {isShowJoinTeamBtn && (
                  <Button
                    className="w-100"
                    onClick={() => (this.isShowJoinReqModal = true)}
                  >
                    {t('join_team')}
                  </Button>
                )}
                {teamMemberRole === 'admin' && (
                  <Button
                    className="w-100 mt-2"
                    href={`/activity/${hackathonName}/team/${id}/manage/participant`}
                  >
                    {t('manage_team')}
                  </Button>
                )}
                {isShowLeaveTeamBtn && (
                  <Button
                    className="w-100 mt-2"
                    variant="danger"
                    onClick={this.handleLeaveTeam}
                  >
                    {currentUserInThisTeam?.status === MembershipStatus.APPROVED
                      ? t('leave_team')
                      : t('cancel_application')}
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                <h2 className="text-dark fw-bold h6 ">
                  <Icon name="people-fill" /> {t('team_members')}
                </h2>
                <ScrollList
                  translator={i18n}
                  store={this.store}
                  renderList={allItems => (
                    <TeamMemberListLayout defaultData={allItems} />
                  )}
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
                  activity={hackathonName}
                  team={id}
                  defaultData={teamWorkList}
                  controls={!!currentUserInThisTeam}
                />
              </Tab>
            </Tabs>
          </Col>
        </Row>
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
