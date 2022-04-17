import classNames from 'classnames';
import React from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { Container, Row, Col, Card, Button, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faQq,
  faWeixin,
  faWeibo,
} from '@fortawesome/free-brands-svg-icons';

import PageHead from '../../components/PageHead';
import { ActivityList } from '../../components/ActivityList';
import { User } from '../../models/User';
import { request } from '../api/core';

const UserDetailPage = ({
  nickname,
  photo,
  registerSource,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <PageHead title="用户资料" />

      <Container
        style={{
          background:
            'url(https://hackathon-api.static.kaiyuanshe.cn/static/profile-back-pattern.png)',
        }}
      >
        <Row>
          <Col lg="auto">
            <Container className="mb-4">
              <Card border="secondery" className="border">
                <Card.Title as="h2" className="m-3">
                  {nickname}
                </Card.Title>
                <Card.Img
                  src={photo}
                  style={{ width: '6.5rem' }}
                  className="mx-3 mb-3"
                  alt=""
                />

                <Card.Body className="text-start border-top p-3">
                  <Link href={`https://github.com/${nickname}`} passHref>
                    <FontAwesomeIcon
                      className={classNames(
                        'fa-stack',
                        registerSource.includes(`social:github`)
                          ? 'text-success'
                          : 'text-secondary',
                      )}
                      icon={faGithub}
                    />
                  </Link>
                  <FontAwesomeIcon
                    className="text-secondary fa-stack"
                    icon={faQq}
                  />
                  <FontAwesomeIcon
                    className="text-secondary fa-stack"
                    icon={faWeixin}
                  />
                  <FontAwesomeIcon
                    className="text-secondary fa-stack"
                    icon={faWeibo}
                  />
                </Card.Body>
                <Card.Body className="text-center border-top p-3">
                  <Link href="https://ophapiv2-demo.authing.cn/u" passHref>
                    <Button variant="warning">编辑用户资料</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Container>
          </Col>
          <Col>
            <Container className="mb-4" fluid="lg">
              <Tabs
                defaultActiveKey="enroll"
                className="w-100 mb-3 justify-content-center"
              >
                <Tab eventKey="enroll" title="参与的活动">
                  <ActivityList type="enrolled" />
                </Tab>
                <Tab eventKey="admin" title="创建的活动">
                  <ActivityList type="admin" />
                </Tab>
                <Tab eventKey="contact" title="关注的活动"></Tab>
              </Tabs>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export async function getServerSideProps({
  params: { id } = {},
}: GetServerSidePropsContext<{ id?: string }>) {
  if (!id)
    return {
      notFound: true,
      props: {} as User,
    };
  const userInfo = await request<User>(`user/${id}`);

  return { props: userInfo };
}

export default UserDetailPage;
