import { FormEvent, PureComponent } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import {
  Container,
  Row,
  Col,
  Card,
  Tabs,
  Tab,
  Button,
  Modal,
  Form,
} from 'react-bootstrap';
import { observer } from 'mobx-react';
import { Icon } from 'idea-react';
import { observable } from 'mobx';
import { formToJSON } from 'web-utility';

import PageHead from '../../../../../components/PageHead';
import { TeamMemberList } from '../../../../../components/Team/TeamMemberList';
import { TeamWorkList } from '../../../../../components/Team/TeamWorkList';
import activityStore, { Activity } from '../../../../../models/Activity';
import {
  Team,
  TeamWork,
  TeamMember,
  JoinTeamReqBody,
  MembershipStatus,
} from '../../../../../models/Team';
import { ErrorBaseData, isServer } from '../../../../../models/Base';
import sessionStore from '../../../../../models/Session';
import { CommentBox } from '../../../../../components/CommentBox';
import { MainBreadcrumb } from '../../../../../components/MainBreadcrumb';

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

  handleJoinTeam = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const inputParams = formToJSON<JoinTeamReqBody>(event.currentTarget);
    await this.store.joinTeam(inputParams);
    this.isShowJoinReqModal = false;
  };

  handleLeaveTeam = async () => {
    const operation =
      this.currentUserInThisTeam?.status === MembershipStatus.APPROVED
        ? '退出团队'
        : '取消申请';
    if (confirm(`请确定是否${operation}`)) {
      await this.store.leaveTeam();

      alert(`${operation}成功`);
    }
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
    const {
      activity: {
        displayName: hackathonDisplayName,
        eventStartedAt,
        eventEndedAt,
      },
      team: {
        id,
        hackathonName,
        displayName,
        description,
        creator: { photo },
      },
      teamMemberList,
      teamWorkList,
    } = this.props;

    const now = Date.now(),
      eventStarted = new Date(eventStartedAt),
      eventEnded = new Date(eventEndedAt),
      { status } = activityStore?.currentEnrollment?.sessionOne || {},
      { sessionOne } = activityStore.currentTeam || {},
      isShowJoinTeamBtn =
        now > +eventStarted &&
        now < +eventEnded &&
        status === 'approved' &&
        !sessionOne,
      isShowLeaveTeamBtn = sessionOne && sessionOne.id === id;

    const currentRoute = [
        {
          title: hackathonDisplayName,
          href: `/activity/${hackathonName}`,
        },
        {
          title: displayName,
        },
      ],
      { isShowJoinReqModal, handleJoinTeam } = this;

    return (
      <Container as="main">
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
                {this.teamMemberRole === 'admin' && (
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
                    {this.currentUserInThisTeam?.status ===
                    MembershipStatus.APPROVED
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
                />
              </Tab>
            </Tabs>
          </Col>
        </Row>
        <CommentBox />

        <Modal
          show={isShowJoinReqModal}
          onHide={() => (this.isShowJoinReqModal = false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>加入团队</Modal.Title>
          </Modal.Header>
          <Modal.Body as="form" onSubmit={handleJoinTeam}>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label column sm={12}>
                备注
              </Form.Label>
              <Col sm={12}>
                <Form.Control
                  as="textarea"
                  name="description"
                  maxLength={512}
                  rows={3}
                  placeholder="可输入备注信息，以便团队管理员更快通过审核。"
                />
              </Col>
            </Form.Group>

            <Button className="w-100" variant="primary" type="submit">
              发送
            </Button>
          </Modal.Body>
        </Modal>
      </Container>
    );
  }
}
