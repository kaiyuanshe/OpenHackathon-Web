import { Icon } from 'idea-react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { FormEvent, PureComponent } from 'react';
import { Button, Card, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { CommentBox } from '../../../../../components/CommentBox';
import { MainBreadcrumb } from '../../../../../components/MainBreadcrumb';
import PageHead from '../../../../../components/PageHead';
import { JoinTeamModal } from '../../../../../components/Team/JoinTeamModal';
import { TeamMemberList } from '../../../../../components/Team/TeamMemberList';
import { TeamWorkList } from '../../../../../components/Team/TeamWorkList';
import activityStore, { Activity } from '../../../../../models/Activity';
import { ErrorBaseData, isServer } from '../../../../../models/Base';
import sessionStore from '../../../../../models/Session';
import {
  MembershipStatus,
  Team,
  TeamMember,
  TeamWork,
} from '../../../../../models/Team';

interface TeamPageProps {
  activity: Activity;
  team: Team;
  teamMemberList: TeamMember[];
  teamWorkList: TeamWork[];
}

export async function getServerSideProps({
  params: { name = '', tid = '' } = {},
}: GetServerSidePropsContext<{ name?: string; tid?: string }>) {
  try {
    const activity = await activityStore.getOne(name);

    const team = await activityStore.currentTeam!.getOne(tid);

    const teamMemberList =
      await activityStore.currentTeam!.currentMember!.getList();

    const teamWorkList =
      await activityStore.currentTeam!.currentWork!.getList();

    return {
      props: { activity, team, teamMemberList, teamWorkList },
    };
  } catch (error) {
    console.error(error);

    return {
      notFound: true,
      props: {} as TeamPageProps,
    };
  }
}

@observer
export default class TeamPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore
    .teamOf(this.props.activity.name)
    .memberOf(this.props.team.id);

  @observable
  currentUserInThisTeam?: TeamMember;

  @observable
  teamMemberRole = '';

  @observable
  isShowJoinReqModal = false;

  get currentRoute() {
    const {
      activity: { displayName: hackathonDisplayName },
      team: { hackathonName, displayName },
    } = this.props;

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
      { eventStartedAt, eventEndedAt } = this.props.activity,
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
    return activityStore.currentTeam?.sessionOne?.id === this.props.team.id;
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
        ? '退出团队'
        : '取消申请';

    if (!confirm(`请确定是否${operation}`)) return;

    await this.store.leaveTeam();

    alert(`${operation}成功`);
  };

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

    if (status === 'approved')
      try {
        await activityStore.teamOf(name).getSessionOne();
      } catch {}
  }

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
                    加入团队
                  </Button>
                )}
                {teamMemberRole === 'admin' && (
                  <Button
                    className="w-100 mt-2"
                    href={`/activity/${hackathonName}/team/${id}/manage/participant`}
                  >
                    管理团队
                  </Button>
                )}
                {isShowLeaveTeamBtn && (
                  <Button
                    className="w-100 mt-2"
                    variant="danger"
                    onClick={this.handleLeaveTeam}
                  >
                    {currentUserInThisTeam?.status === MembershipStatus.APPROVED
                      ? '退出团队'
                      : '取消申请'}
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                <h2 className="text-dark fw-bold h6 ">
                  <Icon name="people-fill" /> 团队成员
                </h2>
                <TeamMemberList
                  activity={hackathonName}
                  team={id}
                  value={teamMemberList}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={8}>
            <Tabs defaultActiveKey="update" id="activity-detail-tabs">
              <Tab className="pt-2" eventKey="update" title="最新动态">
                <div className="h1 my-5 text-center">暂无消息</div>
              </Tab>
              <Tab eventKey="teamWork" title="团队作品" className="pt-2">
                <TeamWorkList
                  activity={hackathonName}
                  team={id}
                  value={teamWorkList}
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
