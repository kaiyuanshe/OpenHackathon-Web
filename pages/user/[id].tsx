import {
  faGithub,
  faQq,
  faWeibo,
  faWeixin,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '@kaiyuanshe/openhackathon-service';
import dynamic from 'next/dynamic';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Card, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';

import { PageHead } from '../../components/layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import userStore from '../../models/User';

const ActivityList = dynamic(
    () => import('../../components/Activity/ActivityList'),
    { ssr: false },
  ),
  { t } = i18n;

export const getServerSideProps = compose<{ id?: string }, User>(
  cache(),
  errorLogger,
  translator(i18n),
  async ({ params: { id = '' } = {} }) =>
    JSON.parse(JSON.stringify({ props: await userStore.getOne(id) })),
);

const UserDetailPage: FC<User> = ({ id, name, avatar }) => (
  <div
    className="py-4"
    style={{
      background:
        'url(https://hackathon-api.static.kaiyuanshe.cn/static/profile-back-pattern.png)',
    }}
  >
    <PageHead title={t('profile')} />

    <Container>
      <Row className="g-4">
        <Col xs={12} lg={3}>
          <Card border="secondery" className="border">
            <Card.Title as="h2" className="m-3">
              {name}
            </Card.Title>
            <Card.Img
              className="mx-3 mb-3"
              style={{ width: '6.5rem' }}
              src={avatar}
              alt=""
            />
            <Card.Body className="text-start border-top p-3">
              <a
                target="_blank"
                href={`https://github.com/${name}`}
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  className="fa-stack text-success"
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
          </Card>
        </Col>
        <Col xs={12} lg={9}>
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
        </Col>
      </Row>
    </Container>
  </div>
);

export default UserDetailPage;
