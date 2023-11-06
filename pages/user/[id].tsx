import {
  faGithub,
  faQq,
  faWeibo,
  faWeixin,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { Card, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';

import { PageHead } from '../../components/layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import userStore, { User } from '../../models/User';

const ActivityList = dynamic(
    () => import('../../components/Activity/ActivityList'),
    { ssr: false },
  ),
  { t } = i18n;

export const getServerSideProps = compose<{ id?: string }, User>(
  cache(),
  errorLogger,
  translator(i18n),
  async ({ params: { id = '' } = {} }) => ({
    props: await userStore.getOne(id),
  }),
);

const UserDetailPage = ({
  id,
  nickname,
  photo,
  registerSource,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <div
    className="pt-3"
    style={{
      background:
        'url(https://hackathon-api.static.kaiyuanshe.cn/static/profile-back-pattern.png)',
    }}
  >
    <Container>
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
  </div>
);

export default UserDetailPage;
