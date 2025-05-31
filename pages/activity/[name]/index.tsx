import {
  faCalendarDay,
  faFlag,
  faLocationDot,
  faSignIn,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EnrollmentStatus, Hackathon, Media, Organizer } from '@kaiyuanshe/openhackathon-service';
import { Loading } from 'idea-react';
import { computed, observable } from 'mobx';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { ScrollList } from 'mobx-restful-table';
import dynamic from 'next/dynamic';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { Button, Carousel, Col, Container, Image, Row, Tab, Tabs } from 'react-bootstrap';

import { getActivityStatusText } from '../../../components/Activity/ActivityEntry';
import { CommentBox } from '../../../components/CommentBox';
import { PageHead } from '../../../components/layout/PageHead';
import { AnnouncementList } from '../../../components/Message/MessageList';
import { OrganizationListLayout } from '../../../components/Organization/OrganizationList';
import { TeamCard } from '../../../components/Team/TeamCard';
import { TeamCreateModal } from '../../../components/Team/TeamCreateModal';
import { TeamListLayout } from '../../../components/Team/TeamList';
import { isServer } from '../../../configuration';
import activityStore, { ActivityModel } from '../../../models/Activity';
import { i18n, I18nContext } from '../../../models/Base/Translation';
import sessionStore from '../../../models/User/Session';
import { convertDatetime } from '../../../utils/time';

const ChinaMap = dynamic(() => import('../../../components/ChinaMap'), { ssr: false });

interface ActivityPageProps {
  activity: Hackathon;
  organizationList: Organizer[];
}

export const getServerSideProps = compose<{ name?: string }, ActivityPageProps>(
  cache(),
  errorLogger,
  async ({ params: { name = '' } = {} }) => {
    const activityStore = new ActivityModel();

    const [activity, organizationList] = await Promise.all([
      activityStore.getOne(name),
      activityStore.organizationOf(name).getList(),
    ]);

    return { props: { activity, organizationList } };
  },
);

const StatusName = ({ t }: typeof i18n): Record<EnrollmentStatus, string> => ({
  approved: t('sign_up_successfully'),
  rejected: t('rejected'),
  none: t('not_sign_up'),
  pendingApproval: t('already_registered_waiting_for_approval'),
});

@observer
export default class ActivityPage extends ObservedComponent<ActivityPageProps, typeof i18n> {
  static contextType = I18nContext;

  logStore = activityStore.logOf(this.props.activity.id);
  enrollmentStore = activityStore.enrollmentOf(this.props.activity.name);
  teamStore = activityStore.teamOf(this.props.activity.name);
  messageStore = activityStore.announcementOf(this.props.activity.name);

  @observable
  accessor showCreateTeam = false;

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
        } catch {
          //
        }
    } catch {
      //
    }

    try {
      await activityStore.getQuestionnaire(this.props.activity.name);
    } catch {
      //
    }
  }

  registerNow = async () => {
    const { t } = this.observedContext,
      { name } = this.props.activity;

    await activityStore.signOne(name);

    self.alert(textJoin(t('hackathons'), name, t('registration_needs_review')));
  };

  renderMeta() {
    const { github } = sessionStore.metaOAuth,
      { status } = activityStore.currentEnrollment?.sessionOne || {},
      myTeam = activityStore.currentTeam?.sessionOne,
      { questionnaire } = activityStore,
      {
        name,
        location,
        enrollment,
        enrollmentStartedAt,
        enrollmentEndedAt,
        eventStartedAt,
        eventEndedAt,
        ...rest
      } = this.props.activity,
      i18n = this.observedContext;

    const { t } = i18n,
      now = Date.now(),
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
      now > +eventStarted && now < +eventEnded && status === 'approved' && !myTeam;

    return (
      <>
        <ul className="list-unstyled">
          <Row as="li" className="my-2">
            <Col md={4} lg={3}>
              <FontAwesomeIcon className="text-success me-2" icon={faCalendarDay} />
              {t('registration_period')}
            </Col>
            <Col>
              {convertDatetime(enrollmentStartedAt)} ~ {convertDatetime(enrollmentEndedAt)}
            </Col>
          </Row>
          <Row as="li" className="my-2">
            <Col md={4} lg={3}>
              <FontAwesomeIcon className="text-success me-2" icon={faCalendarDay} />
              {t('activity_period')}
            </Col>
            <Col>
              {convertDatetime(eventStartedAt)} ~ {convertDatetime(eventEndedAt)}
            </Col>
          </Row>
          <Row as="li" className="my-2">
            <Col md={4} lg={3}>
              <FontAwesomeIcon className="text-success me-2" icon={faLocationDot} />
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
              {getActivityStatusText(i18n, {
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
            <Col>{StatusName(i18n)[status || 'none']}</Col>
          </Row>
        </ul>
        {isShowSignupBtn &&
          (questionnaire.length ? (
            <Button href={`/activity/${name}/register`} disabled={isDisableSignupBtn}>
              {t('register_now')}
            </Button>
          ) : (
            <Button disabled={isDisableSignupBtn} onClick={this.registerNow}>
              {t('register_now')}
            </Button>
          ))}
        {isShowCreateTeamBtn && (
          <Button onClick={() => (this.showCreateTeam = true)}>{t('create_team')}</Button>
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
    const { t } = this.observedContext,
      { name, displayName, tags, banners, location, detail } = this.props.activity,
      { showCreateTeam, loading } = this,
      { organizationList } = this.props,
      myTeam = activityStore.currentTeam?.sessionOne,
      myMessage = this.messageStore;

    return (
      <Container className="mt-3">
        <PageHead title={displayName} />

        {loading && <Loading />}

        <Row xs={1} sm={1} lg={2}>
          <Carousel>
            {((banners || []) as Media[]).map(({ uri }) => (
              <Carousel.Item key={uri}>
                <div className="d-flex align-items-center" style={{ height: '45vh' }}>
                  <Image className="w-100 h-100 object-fit-cover" src={uri} alt={name} />
                </div>
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
                <AnnouncementList store={myMessage} />
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
                <ScrollList
                  translator={i18n}
                  store={this.teamStore}
                  renderList={allItems => <TeamListLayout defaultData={allItems} />}
                />
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

                <div style={{ minHeight: '10rem' }}>
                  <ChinaMap zoom={10} title={displayName} address={location}>
                    {t('no_address_navigation')}
                  </ChinaMap>
                </div>
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
