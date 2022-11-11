import {
  faCalendarDay,
  faFlag,
  faLocationDot,
  faSignIn,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loading, OpenMap } from 'idea-react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';
import {
  Button,
  Carousel,
  Col,
  Container,
  Image,
  Row,
  Tab,
  Tabs,
} from 'react-bootstrap';

import { getActivityStatusText } from '../../../components/Activity/ActivityEntry';
import { ActivityLogList } from '../../../components/Activity/ActivityLogList';
import { CommentBox } from '../../../components/CommentBox';
import { MessageList } from '../../../components/Message/MessageList';
import { OrganizationCardList } from '../../../components/Organization/OrganizationList';
import PageHead from '../../../components/PageHead';
import { TeamCard } from '../../../components/Team/TeamCard';
import { TeamList } from '../../../components/Team/TeamList';
import { TeamCreateModal } from '../../../components/TeamCreateModal';
import activityStore, { Activity } from '../../../models/Activity';
import { isServer, Media } from '../../../models/Base';
import { Enrollment } from '../../../models/Enrollment';
import { convertDatetime } from '../../../utils/time';

export async function getServerSideProps({
  params: { name = '' } = {},
}: GetServerSidePropsContext<{ name?: string }>) {
  try {
    const activity = await activityStore.getOne(name);

    return { props: { activity } };
  } catch (error) {
    console.error(error);

    return {
      notFound: true,
      props: {} as { activity: Activity },
    };
  }
}

const StatusName: Record<Enrollment['status'], string> = {
  approved: '已报名成功',
  rejected: '已拒绝',
  none: '未报名',
  pendingApproval: '已报名，等待通过',
};

@observer
export default class ActivityPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  organizationStore = activityStore.organizationOf(this.props.activity.name);
  logStore = activityStore.logOf(this.props.activity.name);
  enrollmentStore = activityStore.enrollmentOf(this.props.activity.name);
  teamStore = activityStore.teamOf(this.props.activity.name);
  messageStore = activityStore.messageOf(this.props.activity.name);

  @observable
  showCreateTeam = false;

  @observable
  hideMessageListNotNeed = true;

  @computed
  get loading() {
    return (
      (this.organizationStore.downloading ||
        this.logStore.downloading ||
        this.enrollmentStore.downloading ||
        this.teamStore.downloading) > 0
    );
  }

  async componentDidMount() {
    if (isServer()) return;

    try {
      const { status } = await this.enrollmentStore.getSessionOne();

      if (status === 'approved')
        try {
          await this.teamStore.getSessionOne();
        } catch {}
    } catch {}
  }

  renderMeta() {
    const { status } = this.enrollmentStore.sessionOne || {},
      { sessionOne: myTeam } = this.teamStore || {},
      {
        name,
        location,
        enrollment,
        enrollmentStartedAt,
        enrollmentEndedAt,
        eventStartedAt,
        eventEndedAt,
        ...rest
      } = this.props.activity;

    const now = Date.now(),
      enrollmentEnd = new Date(enrollmentEndedAt),
      enrollmentStart = new Date(enrollmentStartedAt),
      eventEnded = new Date(eventEndedAt),
      eventStarted = new Date(eventStartedAt);
    const isShowSignupBtn =
      now > +enrollmentStart &&
      now < +enrollmentEnd &&
      (!status || ['none', 'reject'].includes(status));
    const isDisableSignupBtn = now < +enrollmentStart;
    const isShowCreateTeamBtn =
      now > +eventStarted &&
      now < +eventEnded &&
      status === 'approved' &&
      !myTeam;

    return (
      <>
        <ul className="list-unstyled">
          <Row as="li" className="my-2">
            <Col md={4} lg={3}>
              <FontAwesomeIcon
                className="text-success me-2"
                icon={faCalendarDay}
              />
              报名时段
            </Col>
            <Col>
              {convertDatetime(enrollmentStartedAt)} ~{' '}
              {convertDatetime(enrollmentEndedAt)}
            </Col>
          </Row>
          <Row as="li" className="my-2">
            <Col md={4} lg={3}>
              <FontAwesomeIcon
                className="text-success me-2"
                icon={faCalendarDay}
              />
              活动时段
            </Col>
            <Col>
              {convertDatetime(eventStartedAt)} ~{' '}
              {convertDatetime(eventEndedAt)}
            </Col>
          </Row>
          <Row as="li" className="my-2">
            <Col md={4} lg={3}>
              <FontAwesomeIcon
                className="text-success me-2"
                icon={faLocationDot}
              />
              活动地址
            </Col>
            <Col>{location}</Col>
          </Row>
          <Row as="li" className="my-2">
            <Col md={4} lg={3}>
              <FontAwesomeIcon className="text-success me-2" icon={faUsers} />
              报名人数
            </Col>
            <Col>{enrollment}</Col>
          </Row>
          <Row as="li" className="my-2">
            <Col md={4} lg={3}>
              <FontAwesomeIcon className="text-success me-2" icon={faFlag} />
              活动状态
            </Col>
            <Col>
              {getActivityStatusText({
                ...rest,
                enrollmentStartedAt,
                enrollmentEndedAt,
                eventStartedAt,
                eventEndedAt,
              })}
            </Col>
          </Row>
          <Row as="li" className="my-2">
            <Col md={4} lg={3}>
              <FontAwesomeIcon className="text-success me-2" icon={faSignIn} />
              报名状态
            </Col>
            <Col>{StatusName[status || 'none']}</Col>
          </Row>
        </ul>
        {isShowSignupBtn && (
          <Button
            href={`/activity/${name}/register`}
            disabled={isDisableSignupBtn}
          >
            立即报名
          </Button>
        )}
        {isShowCreateTeamBtn && (
          <Button onClick={() => (this.showCreateTeam = true)}>创建团队</Button>
        )}
        {myTeam && (
          <Button
            variant="warning"
            href={`/activity/${name}/team/${myTeam.id}/manage/git`}
          >
            云开发
          </Button>
        )}
      </>
    );
  }

  render() {
    const { name, displayName, tags, banners, location, detail } =
        this.props.activity,
      { showCreateTeam, loading } = this,
      myTeam = this.teamStore.sessionOne,
      myMessage = this.messageStore;

    return (
      <Container className="mt-3">
        <PageHead title={displayName} />

        {loading && <Loading />}

        <Row xs={1} sm={1} lg={2}>
          <Carousel>
            {((banners || []) as Media[]).map(({ uri }) => (
              <Carousel.Item key={uri}>
                <Image className="d-block w-100" src={uri} alt={name} />
              </Carousel.Item>
            ))}
          </Carousel>
          <Col className="d-flex flex-column justify-content-start">
            <h2>{displayName}</h2>
            <aside className="pb-2">
              {((tags || []) as string[]).map(tag => (
                <span key={tag} className="badge bg-success me-2">
                  {tag}
                </span>
              ))}
            </aside>

            {this.renderMeta()}
          </Col>
        </Row>
        <Row className="mt-3">
          <Col lg={9} md={12} sm={12} className="mb-3">
            <Tabs defaultActiveKey="detail" id="activity-detail-tabs">
              <Tab
                as="article"
                className="pt-2"
                eventKey="detail"
                title="活动详情"
                dangerouslySetInnerHTML={{ __html: detail }}
              >
                {/*todo update no data*/}
              </Tab>
              <Tab className="pt-2" eventKey="log" title="最新动态">
                <ActivityLogList store={this.logStore} />
                {/* <MessageList
                  store={myMessage}
                  hide={this.hideMessageListNotNeed}
                /> */}
              </Tab>
              <Tab eventKey="team" title="参赛团队" className="pt-2">
                <h3>我的团队</h3>
                {myTeam ? (
                  <Row className="g-4" xs={1} md={2} lg={2} xxl={2}>
                    <Col>
                      <TeamCard {...myTeam} />
                    </Col>
                  </Row>
                ) : (
                  '暂未加入任何团队'
                )}
                <hr />
                <h3>所有团队</h3>
                <TeamList store={this.teamStore} />
              </Tab>
            </Tabs>
          </Col>
          <Col className="d-flex flex-column">
            <h2>主办方信息</h2>
            <OrganizationCardList store={this.organizationStore} />

            {displayName && location && (
              <>
                <h2 className="mt-3">比赛地点</h2>

                {!isServer() && (
                  <div style={{ minHeight: '10rem' }}>
                    <OpenMap zoom={10} title={displayName} address={location}>
                      暂无地址导航
                    </OpenMap>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>

        <CommentBox />

        <TeamCreateModal
          show={showCreateTeam}
          hackathonName={name}
          onClose={() => (this.showCreateTeam = false)}
        />
      </Container>
    );
  }
}
