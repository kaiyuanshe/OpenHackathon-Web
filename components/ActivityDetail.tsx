import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col, Tabs, Tab, Carousel, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faLocationDot, faUsers } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import { Team } from "../models/Team";
import { Activity } from "../pages/api/Activity";
import { ListData, request } from "../pages/api/core";

const ActivityDetail: React.FC<{ activity: Activity }> = ({ activity }) => {
  const getTeams = useCallback(async () => {
    const { value } = await request<ListData<Team>>(`hackathon/${activity.name}/teams?top=10`);
    setTeams(value);
  }, [activity.name]);

  const [teams, setTeams] = useState<Team[]>([]);
  useEffect(() => {
    getTeams();
  }, [getTeams]);

  return <Container>
    <Row xs={1} sm={1} lg={2}>
      <Carousel>
        {activity.banners.map(({ uri }, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={uri}
              alt={activity.name}
            />
          </Carousel.Item>
        ))}
      </Carousel>
      <div className="d-flex flex-column justify-content-start">
        <h2>{activity.displayName}</h2>
        <aside className="pb-2">
          {activity.tags.map((tag, index) => {
            return <span key={index} className="badge bg-success me-2">{tag}</span>;
          })}
        </aside>
        <Row key="enrollment">
          <Col as="label" md={4} lg={3}>报名时段
            {" "}<FontAwesomeIcon className="text-success" icon={faCalendarDay} />
          </Col>
          <Col as="p" className="col-auto">
            {convertDatetime(activity.enrollmentStartedAt)} ~ {convertDatetime(activity.enrollmentEndedAt)}
          </Col>
        </Row>
        <Row key="activity">
          <Col as="label" md={4} lg={3}>活动时段
            {" "}<FontAwesomeIcon className="text-success" icon={faCalendarDay} />
          </Col>
          <Col as="p" className="col-auto">
            {convertDatetime(activity.eventStartedAt) + " ~ " + convertDatetime(activity.eventEndedAt)}
          </Col>
        </Row>
        <Row key="location">
          <Col as="label" md={4} lg={3}>活动地址
            {" "}<FontAwesomeIcon className="text-success" icon={faLocationDot} />
          </Col>
          <Col as="p" className="col-auto">{activity.location}</Col>
        </Row>
        <Row key="number">
          <Col as="label" md={4} lg={3}>报名人数
            {" "}<FontAwesomeIcon className="text-success" icon={faUsers} />
          </Col>
          <Col as="p" className="col-auto">{activity.location}</Col>
        </Row>
        <Link href={{ pathname: "/activity/register", query: { name: activity.name } }} passHref>
          <Button className="col-3 btn btn-success">报名</Button>
        </Link>
      </div>
    </Row>
    <Row>
      <Col lg={9} md={12} sm={12}>
        <Tabs defaultActiveKey="detail" id="activity-detail-tabs">
          <Tab eventKey="detail" title="活动详情" className="pt-2" dangerouslySetInnerHTML={{ __html: activity.detail }}>
          </Tab>
          {/*todo update no data*/}
          <Tab eventKey="update" title="最新动态" className="pt-2">
            <h1>todo update</h1>
          </Tab>
          <Tab eventKey="team" title="所有团队" className="pt-2">
            <Row xs={1} md={2} lg={2} xxl={2} className="g-4">
              {teams.map((team, index) => (
                <Col key={index}>
                  <div className="border p-2">
                    <a href={`team?activity=${activity.name}&${team.id}`}
                       className="fs-4 text-primary text-truncate">{team.displayName}</a>
                    <p className="border-bottom">共
                      <span className="text-success">
                      {` ${team.membersCount} `}
                    </span>
                      人</p>
                    <div className="d-flex">
                      <Link href={`/user?uid=${team.creatorId}`} passHref>
                        <>
                          <p className="pe-2">队长:{`  `}</p>
                          <p className="text-primary">
                          <span>
                            <img src={team.creator.photo} alt="team-creator-photo"
                                 style={{ maxWidth: "1.5rem", height: "auto" }} />
                          </span>
                            {` ${team.creator.nickname}`}
                          </p>
                        </>
                      </Link>
                    </div>
                  </div>
                </Col>
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
  </Container>;
};

function convertDatetime(datetime: string): string {
  return moment(new Date(datetime)).format("YYYY-MM-DD HH:mm:ss");
}

export default ActivityDetail;