import type { InferGetServerSidePropsType } from 'next';
import { Container, Row, Col, Button, Carousel, Image } from 'react-bootstrap';

import PageHead from '../components/PageHead';
import { ActivityCard } from '../components/ActivityCard';
import { ListData, request } from './api/core';
import { Activity } from './api/Activity';
import { OrganizationType, OrganizationTypeName, partner } from './api/home';

export async function getServerSideProps() {
  const { value } = await request<ListData<Activity>>('hackathons?top=10');

  return { props: { activities: value } };
}

const HomePage = ({
  activities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <>
    <PageHead />

    <Container className="mt-4">
      <Carousel>
        {activities
          .filter(({ banners }) => banners?.[0])
          .map(
            ({ name: key, displayName, ribbon, banners: [{ uri, name }] }) => (
              <Carousel.Item key={key}>
                <img
                  className="d-block w-100"
                  style={{ height: '80vh', objectFit: 'cover' }}
                  src={uri}
                  alt={name}
                />
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
        <Row className="g-4" xs={1} sm={2} lg={3} xxl={4}>
          {activities.slice(0, 6).map(activity => (
            <Col key={activity.name}>
              <ActivityCard className="h-100" {...activity} />
            </Col>
          ))}
        </Row>
      </Container>

      <Button variant="outline-primary" size="sm" className="px-5 mt-5">
        更多活动
      </Button>
    </section>

    <Container className="text-center">
      {Object.entries(partner).map(([type, list]) => (
        <>
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
                <a target="_blank" rel="noreferrer" href={url}>
                  <Image fluid src={logo} />
                </a>
              </Col>
            ))}
          </Row>
        </>
      ))}
    </Container>
  </>
);

export default HomePage;
