import { Hackathon, UserRank } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC, Fragment } from 'react';
import { Button, Carousel, Col, Container, Image, Row } from 'react-bootstrap';

import { ActivityListLayout } from '../components/Activity/ActivityList';
import { PageHead } from '../components/layout/PageHead';
import { UserRankView } from '../components/User/TopUserList';
import { ActivityModel } from '../models/Activity';
import { i18n, t } from '../models/Base/Translation';
import { UserModel } from '../models/User';
import { OrganizationType, OrganizationTypeName, partner } from './api/home';

interface HomePageProps {
  activities: Hackathon[];
  topUsers: UserRank[];
}

export const getServerSideProps = compose<{}, HomePageProps>(
  cache(),
  errorLogger,
  translator(i18n),
  async () => {
    const [activities, topUsers] = await Promise.all([
      new ActivityModel().getList({}, 1, 6),
      new UserModel().getUserTopList(),
    ]);

    return { props: JSON.parse(JSON.stringify({ activities, topUsers })) };
  },
);

const HomePage: FC<HomePageProps> = observer(({ activities, topUsers }) => (
  <>
    <PageHead />

    <Container className="mt-5">
      <Carousel>
        {activities
          .filter(({ banners }) => banners?.[0])
          .map(
            ({ name: key, displayName, ribbon, banners: [{ uri, name }] }) => (
              <Carousel.Item key={key}>
                <a
                  className="d-block stretched-link"
                  href={`/activity/${key}/`}
                >
                  <Image
                    className="w-100 object-fit-cover"
                    style={{ height: '80vh' }}
                    src={uri}
                    alt={name}
                  />
                </a>
                <Carousel.Caption className="text-shadow">
                  <h3>{displayName}</h3>
                  <p>{ribbon}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ),
          )}
      </Carousel>
    </Container>

    <section className="my-5 py-5 bg-light text-center">
      <Container className="text-start">
        <ActivityListLayout defaultData={activities} />
      </Container>

      <Button
        className="px-5 mt-5"
        variant="outline-primary"
        size="sm"
        href="/activity/"
      >
        {t('more_events')}
      </Button>
    </section>

    <div
      className="text-center"
      style={{
        background: 'linear-gradient(#F8F9FA,#fff)',
        marginTop: '-3rem',
      }}
    >
      <Container className="text-start">
        <UserRankView value={topUsers} />
      </Container>
    </div>

    <Container className="text-center">
      {Object.entries(partner()).map(([type, list]) => (
        <Fragment key={type}>
          <h3 className="my-5">
            {OrganizationTypeName()[+type as OrganizationType]}
          </h3>
          <Row
            as="ul"
            className="list-unstyled justify-content-around g-4"
            xs={2}
            sm={3}
            md={4}
            xl={6}
          >
            {list.map(({ name, url, logo }) => (
              <Col as="li" key={name} title={name}>
                <a target="_blank" href={url} rel="noreferrer">
                  <Image fluid src={logo} alt={name} />
                </a>
              </Col>
            ))}
          </Row>
        </Fragment>
      ))}
    </Container>
  </>
));

export default HomePage;
