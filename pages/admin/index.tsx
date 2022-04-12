import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { Row, Col, Container } from 'react-bootstrap';

import { ActivityCard } from '../../components/ActivityCard';
import { ListData } from '../../models/Base';
import { Activity } from '../../models/Activity';
import { request } from '../api/core';

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const { value } = await request<ListData<Activity>>(
    'hackathons?listType=admin',
    'GET',
    undefined,
    { req, res },
  );
  return { props: { list: value } };
}

export default function AdminPage({
  list,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container fluid>
      <Row sm={2} md={4} className="g-4">
        {list.map(item => (
          <Col key={item.name}>
            <ActivityCard className="h-100" {...item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
