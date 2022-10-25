import {
  faGithub,
  faQq,
  faWeibo,
  faWeixin,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { t } from 'i18next';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';
import { Button, Card, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import userStore, { User } from '../../models/User';

const ActivityList = dynamic(
  () => import('../../components/Activity/ActivityList'),
  { ssr: false },
);

const UserDetailPage = ({
  id,
  nickname,
  photo,
  registerSource,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Container
    style={{
      background:
        'url(https://hackathon-api.static.kaiyuanshe.cn/static/profile-back-pattern.png)',
    }}
  >
    <PageHead title={t('profile')} />

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
              <a
                target="_blank"
                href={`https://github.com/${nickname}`}
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  className={classNames(
                    'fa-stack',
                    registerSource.includes(`social:github`)
                      ? 'text-success'
                      : 'text-secondary',
                  )}
                  icon={faGithub}
                />
              </a>
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
                <Button variant="warning">{t('edit_profile')}</Button>
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
            <Tab eventKey="enroll" title={t('followed_hackathons')}>
              <ActivityList type="enrolled" userId={id} />
            </Tab>
            <Tab eventKey="created" title={t('owned_hackathons')}>
              <ActivityList type="created" userId={id} />
            </Tab>
            <Tab eventKey="admin" title={t('joined_hackathons')}>
              <ActivityList type="admin" userId={id} />
            </Tab>
          </Tabs>
        </Container>
      </Col>
    </Row>
  </Container>
);

export async function getServerSideProps({
  params: { id = '' } = {},
}: GetServerSidePropsContext<{ id?: string }>) {
  try {
    return {
      props: await userStore.getOne(id),
    };
  } catch (error) {
    console.error(error);

    return {
      notFound: true,
      props: {} as User,
    };
  }
}

export default UserDetailPage;
