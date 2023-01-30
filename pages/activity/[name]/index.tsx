import {
  faCalendarDay,
  faFlag,
  faLocationDot,
  faSignIn,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loading } from 'idea-react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
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
import { CommentBox } from '../../../components/CommentBox';
import { MessageList } from '../../../components/Message/MessageList';
import { OrganizationListLayout } from '../../../components/Organization/OrganizationList';
import PageHead from '../../../components/PageHead';
import { TeamCard } from '../../../components/Team/TeamCard';
import { TeamList } from '../../../components/Team/TeamList';
import { TeamCreateModal } from '../../../components/TeamCreateModal';
import activityStore, {
  Activity,
  ActivityModel,
} from '../../../models/Activity';
import { isServer, Media } from '../../../models/Base';
import { Enrollment } from '../../../models/Enrollment';
import { Organization } from '../../../models/Organization';
import sessionStore from '../../../models/Session';
import { i18n } from '../../../models/Translation';
import { convertDatetime } from '../../../utils/time';
import { withErrorLog, withTranslation } from '../../api/core';

const { t } = i18n;

const ChinaMap = dynamic(() => import('../../../components/ChinaMap'), {
  ssr: false,
});

export const getServerSideProps = withErrorLog<
  { name?: string },
  { activity: Activity; organizationList: Organization[] }
>(
  withTranslation(async ({ params: { name = '' } = {} }) => {
    const activityStore = new ActivityModel();

    const [activity, organizationList] = await Promise.all([
      activityStore.getOne(name),
      activityStore.organizationOf(name).getList(),
    ]);
    return { props: { activity, organizationList } };
  }),
);

const StatusName: Record<Enrollment['status'], string> = {
  approved: t('sign_up_successfully'),
  rejected: t('rejected'),
  none: t('not_sign_up'),
  pendingApproval: t('already_registered_waiting_for_approval'),
};

@observer
export default class ActivityPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  logStore = activityStore.logOf(this.props.activity.name);
  enrollmentStore = activityStore.enrollmentOf(this.props.activity.name);
  teamStore = activityStore.teamOf(this.props.activity.name);
  messageStore = activityStore.messageOf(this.props.activity.name);

  @observable
  showCreateTeam = false;

  @computed
  get loading() {
    return (
      (this.logStore.downloading ||
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
    const { github } = sessionStore.metaOAuth,
      { status } = this.enrollmentStore.sessionOne || {},
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
              {t('registration_period')}
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
              {t('activity_period')}
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
              {t('activity_address')}
            </Col>
            <Col>{location}</Col>
          </Row>
          <Row as="li" className="my-2">
            <Col md={4} lg={3}>
              <FontAwesomeIcon className="text-success me-2" icon={faUsers} />
              {t('registration_count')}
            </Col>
            <Col>{enrollment}</Col>
          </Row>
          <Row as="li" className="my-2">
            <Col md={4} lg={3}>
              <FontAwesomeIcon className="text-success me-2" icon={faFlag} />
              {t('activity_status')}
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
              {t('registration_status')}
            </Col>
            <Col>{StatusName[status || 'none']}</Col>
          </Row>
        </ul>
        {isShowSignupBtn && (
          <Button
            href={`/activity/${name}/register`}
            disabled={isDisableSignupBtn}
          >
            {t('register_now')}
          </Button>
        )}
        {isShowCreateTeamBtn && (
          <Button onClick={() => (this.showCreateTeam = true)}>
            {t('create_team')}
          </Button>
        )}
        {myTeam && (
          <Button
            variant="warning"
            href={`/activity/${name}/team/${myTeam.id}/manage/git`}
            disabled={!github}
          >
            {t('cloud_development')}
            {github ? '' : t('please_use_github_login')}
          </Button>
        )}
      </>
    );
  }

  render() {
    const { name, displayName, tags, banners, location, detail } =
        this.props.activity,
      { showCreateTeam, loading } = this,
      { organizationList } = this.props,
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
                title={t('hackathon_detail')}
                dangerouslySetInnerHTML={{ __html: detail }}
              >
                {/*todo update no data*/}
              </Tab>
              <Tab className="pt-2" eventKey="log" title={t('latest_news')}>
                <MessageList store={myMessage} hideControls />
              </Tab>
              <Tab eventKey="team" title={t('all_teams')} className="pt-2">
                <h3>{t('my_team')}</h3>
                {myTeam ? (
                  <Row className="g-4" xs={1} md={2} lg={2} xxl={2}>
                    <Col>
                      <TeamCard {...myTeam} />
                    </Col>
                  </Row>
                ) : (
                  t('no_team')
                )}
                <hr />
                <h3>{t('all_teams')}</h3>
                <TeamList store={this.teamStore} />
              </Tab>
            </Tabs>
          </Col>
          <Col className="d-flex flex-column">
            {organizationList.length > 0 && (
              <>
                <h2>{t('sponsor_information')}</h2>
                <OrganizationListLayout defaultData={organizationList} />
              </>
            )}

            {displayName && location && (
              <>
                <h2 className="mt-3">{t('competition_location')}</h2>

                {!isServer() && (
                  <div style={{ minHeight: '10rem' }}>
                    <ChinaMap zoom={10} title={displayName} address={location}>
                      {t('no_address_navigation')}
                    </ChinaMap>
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
