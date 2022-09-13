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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay,
  faLocationDot,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

import { convertDatetime } from '../../../utils/time';
import PageHead from '../../../components/PageHead';
import { LocationMap } from '../../../components/LocationMap';
import { ActivityEntry } from '../../../components/ActivityEntry';
import { TeamCard } from '../../../components/TeamCard';
import { Media, ListData } from '../../../models/Base';
import { Activity } from '../../../models/Activity';
import { Team } from '../../../models/Team';
import { request } from '../../api/core';

export async function getServerSideProps({
  req,
  res,
  params: { name } = {},
}: GetServerSidePropsContext<{ name?: string }>) {
  if (!name)
    return {
      notFound: true,
      props: {} as { activity: Activity; teams: Team[] },
    };

  const activity = await request<Activity>(
      `hackathon/${name}`,
      'GET',
      undefined,
      { req, res },
    ),
    { value: teams } = await request<ListData<Team>>(
      `hackathon/${name}/teams?top=1000`,
      'GET',
      undefined,
      { req, res },
    );

  if (activity.detail) {
    activity.detail = activity.detail
      .replace(/\\+n/g, '\n')
      .replace(/\\+t/g, ' ')
      .replace(/\\+"/g, '"');
  }

  return { props: { activity, teams } };
}

export default function HackathonActivity({
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
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
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
              {teams[0] ? (
                <Row xs={1} md={2} lg={2} xxl={2} className="g-4">
                  {(teams as Team[]).map(team => (
                    <TeamCard key={team.id} {...team} />
                  ))}
                </Row>
              ) : (
                <div className="h1 my-5 text-center">尚无参赛队</div>
              )}
            </Tab>
          </Tabs>
        </Col>
        {displayName && location && (
          <Col className="d-flex flex-column" style={{ height: '50vh' }}>
            <h2>比赛地点</h2>

            <LocationMap title={displayName} address={location}>
              暂无地址导航
            </LocationMap>
          </Col>
        )}
      </Row>
    </Container>
  );
}
