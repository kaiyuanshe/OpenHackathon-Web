import { Fragment } from 'react';
import type { InferGetServerSidePropsType } from 'next';
import { Container, Row, Col, Button, Carousel, Image } from 'react-bootstrap';

import PageHead from '../components/PageHead';
import { ActivityList } from '../components/Activity/ActivityList';
import activityStore from '../models/Activity';
import { OrganizationType, OrganizationTypeName, partner } from './api/home';

export async function getServerSideProps() {
  const activities = await activityStore.getList({}, 1, 6);

  return { props: { activities } };
}

const HomePage = ({
  activities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <>
    <PageHead />

    <Container>
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
                    className="w-100"
                    style={{ height: '80vh', objectFit: 'cover' }}
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
        <ActivityList.Layout value={activities} />
      </Container>

      <Button
        className="px-5 mt-5"
        variant="outline-primary"
        size="sm"
        href="/activity/"
      >
        更多活动
      </Button>
    </section>

    <Container className="text-center">
      {Object.entries(partner).map(([type, list]) => (
        <Fragment key={type}>
          <h3 className="my-5">
            {OrganizationTypeName[+type as OrganizationType]}
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
);

export default HomePage;
