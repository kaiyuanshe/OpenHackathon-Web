import React from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Carousel,
  Button,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay,
  faLocationDot,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

import { convertDatetime } from '../../components/time';
import PageHead from '../../components/PageHead';
import { LocationMap } from '../../components/LocationMap';
import { TeamCard } from '../../components/TeamCard';
import { ListData } from '../../models/Base';
import { Activity } from '../../models/Activity';
import { Team } from '../../models/Team';
import { request } from '../api/core';

export async function getServerSideProps({
  params: { hackathonName } = {},
}: GetServerSidePropsContext<{ hackathonName?: string }>) {
  if (!hackathonName)
    return {
      notFound: true,
      props: {} as { activity: Activity; teams: Team[] },
    };

  const activity = await request<Activity>(`hackathon/${hackathonName}`),
    { value: teams } = await request<ListData<Team>>(
      `hackathon/${hackathonName}/teams?top=1000`,
    );
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
  },
  teams,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container>
      <PageHead title={displayName} />

      <Row xs={1} sm={1} lg={2}>
        <Carousel>
          {banners.map(({ uri }) => (
            <Carousel.Item key={uri}>
              <img className="d-block w-100" src={uri} alt={name} />
            </Carousel.Item>
          ))}
        </Carousel>
        <div className="d-flex flex-column justify-content-start">
          <h2>{displayName}</h2>
          <aside className="pb-2">
            {tags.map(tag => (
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
          <Link
            href={{
              pathname: '/activity/register',
              query: { name },
            }}
            passHref
          >
            <Button variant="success" className="col-3">
              报名
            </Button>
          </Link>
        </div>
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
                  {teams.map(team => (
                    <TeamCard key={team.id} {...team} />
                  ))}
                </Row>
              ) : (
                <div className="h1 my-5 text-center">尚无参赛队</div>
              )}
            </Tab>
          </Tabs>
        </Col>
        <Col>
          <h2>比赛地点</h2>

          <LocationMap title={displayName} address={location} />
        </Col>
      </Row>
    </Container>
  );
}
