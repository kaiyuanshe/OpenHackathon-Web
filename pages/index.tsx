import type { InferGetServerSidePropsType } from 'next';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';

import PageHead from '../components/PageHead';
import styles from '../styles/Home.module.less';
import { ListData, request } from './api/core';
import { Activity } from './api/Activity';
import { mainNav, framework } from './api/home';

export async function getServerSideProps() {
  const { value } = await request<ListData<Activity>>('hackathons?top=10');

  return { props: { activities: value, mainNav, framework } };
}

const HomePage = ({
  activities,
  mainNav,
  framework,
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
    <main
      className={`flex-fill d-flex flex-column justify-content-center align-items-center ${styles.main}`}
    >
      <h1 className={`m-0 text-center ${styles.title}`}>
        Welcome to
        <a className="text-primary mx-2" href="https://nextjs.org">
          Next.js!
        </a>
      </h1>

      <p className={`text-center fs-4 ${styles.description}`}>
        Get started by editing
        <code className={`mx-2 rounded-3 bg-light ${styles.code}`}>
          pages/index.tsx
        </code>
      </p>

      <div
        className={`d-flex flex-wrap flex-column flex-sm-row justify-content-center align-items-center ${styles.grid}`}
      >
        {mainNav.map(({ link, title, summary }) => (
          <Card
            key={link}
            className={`m-3 p-4 rounded-3 border ${styles.card}`}
            tabIndex={-1}
          >
            <Card.Body>
              <Card.Title as="h2" className="fs-4 mb-3">
                <a href={link} className="stretched-link">
                  {title} &rarr;
                </a>
              </Card.Title>
              <Card.Text className="fs-5">{summary}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>

      <h2 className="my-4 text-center">Upstream projects</h2>
      <Row>
        {framework.map(({ logo, title, summary, link, repository }) => (
          <Col sm={4} key={title}>
            <Card className={`h-100 ${styles.card}`}>
              <Card.Img variant="top" src={logo} className={styles.cardImg} />
              <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{summary}</Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-around">
                <Button variant="primary" href={link}>
                  Home Page
                </Button>
                <Button variant="success" href={repository}>
                  Source Code
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </main>
  </>
);

export default HomePage;
