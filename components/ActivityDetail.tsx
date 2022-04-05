import React, { useCallback, useEffect, useState } from 'react';
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
import { formatDate } from 'web-utility';

import { TeamCard } from './TeamCard';
import { ListData, request } from '../pages/api/core';
import { Activity } from '../pages/api/Activity';
import { Team } from '../models/Team';

export const ActivityDetail: React.FC<{ activity: Activity }> = ({
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
    detail,
  },
}) => {
  const getTeams = useCallback(async () => {
    const { value } = await request<ListData<Team>>(
      `hackathon/${name}/teams?top=10`,
    );
    setTeams(value);
  }, [name]);

  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    getTeams();
  }, [getTeams]);

  return (
    <Container>
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
          <Row key="enrollment">
            <Col as="label" md={4} lg={3}>
              报名时段{' '}
              <FontAwesomeIcon className="text-success" icon={faCalendarDay} />
            </Col>
            <Col as="p">
              {convertDatetime(enrollmentStartedAt)} ~{' '}
              {convertDatetime(enrollmentEndedAt)}
            </Col>
          </Row>
          <Row key="activity">
            <Col as="label" md={4} lg={3}>
              活动时段{' '}
              <FontAwesomeIcon className="text-success" icon={faCalendarDay} />
            </Col>
            <Col as="p">
              {convertDatetime(eventStartedAt)} ~{' '}
              {convertDatetime(eventEndedAt)}
            </Col>
          </Row>
          <Row key="location">
            <Col as="label" md={4} lg={3}>
              活动地址{' '}
              <FontAwesomeIcon className="text-success" icon={faLocationDot} />
            </Col>
            <Col as="p">{location}</Col>
          </Row>
          <Row key="number">
            <Col as="label" md={4} lg={3}>
              报名人数{' '}
              <FontAwesomeIcon className="text-success" icon={faUsers} />
            </Col>
          </Row>
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
      <Row>
        <Col lg={9} md={12} sm={12}>
          <Tabs defaultActiveKey="detail" id="activity-detail-tabs">
            <Tab
              className="pt-2"
              eventKey="detail"
              title="活动详情"
              dangerouslySetInnerHTML={{ __html: detail }}
            >
              {/*todo update no data*/}
            </Tab>
            <Tab className="pt-2" eventKey="update" title="最新动态">
              <h1>todo update</h1>
            </Tab>
            <Tab eventKey="team" title="所有团队" className="pt-2">
              <Row xs={1} md={2} lg={2} xxl={2} className="g-4">
                {teams.map(team => (
                  <TeamCard key={team.id} {...team} />
                ))}
              </Row>
            </Tab>
          </Tabs>
        </Col>
        <Col className="col-auto">
          {/*todo location*/}
          <h2>todo location</h2>
        </Col>
      </Row>
    </Container>
  );
};

const convertDatetime = (datetime: string) =>
  formatDate(datetime, 'YYYY-MM-DD HH:mm:ss');
