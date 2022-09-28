import React from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Carousel,
  Image,
} from 'react-bootstrap';
import { OpenMap } from 'idea-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay,
  faLocationDot,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

import { convertDatetime } from '../../../utils/time';
import PageHead from '../../../components/PageHead';
import { ActivityEntry } from '../../../components/Activity/ActivityEntry';
import { TeamList } from '../../../components/Team/TeamList';
import { Media } from '../../../models/Base';
import activityStore, { Activity } from '../../../models/Activity';
import { Team } from '../../../models/Team';

export async function getServerSideProps({
  params: { name = '' } = {},
}: GetServerSidePropsContext<{ name?: string }>) {
  try {
    const activity = await activityStore.getOne(name),
      teams = await activityStore.currentTeam!.getList();

    return { props: { activity, teams } };
  } catch (error) {
    console.error(error);

    return {
      notFound: true,
      props: {} as { activity: Activity; teams: Team[] },
    };
  }
}

const HackathonActivity = ({
  activity: {
    name,
    displayName,
    tags,
    banners,
    enrollmentStartedAt,
    enrollmentEndedAt,
    eventStartedAt,
    eventEndedAt,
    location,
    enrollment,
    detail,
    ...rest
  },
  teams,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Container>
    <PageHead title={displayName} />

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
        </ul>
        <ActivityEntry
          {...{
            ...rest,
            enrollmentStartedAt,
            enrollmentEndedAt,
            eventStartedAt,
            eventEndedAt,
          }}
          href={`/activity/${name}/register`}
        />
      </Col>
    </Row>
    <Row className="mt-3">
      <Col lg={9} md={12} sm={12}>
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
          <Tab className="pt-2" eventKey="update" title="最新动态">
            <div className="h1 my-5 text-center">暂无消息</div>
          </Tab>
          <Tab eventKey="team" title="所有团队" className="pt-2">
            <TeamList activity={name} value={teams} />
          </Tab>
        </Tabs>
      </Col>
      {displayName && location && (
        <Col className="d-flex flex-column" style={{ height: '50vh' }}>
          <h2>比赛地点</h2>

          {typeof window !== 'undefined' && (
            <OpenMap zoom={10} title={displayName} address={location}>
              暂无地址导航
            </OpenMap>
          )}
        </Col>
      )}
    </Row>
  </Container>
);

export default HackathonActivity;
