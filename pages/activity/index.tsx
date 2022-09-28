import { InferGetServerSidePropsType } from 'next';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import ActivityList from '../../components/Activity/ActivityList';
import activityStore from '../../models/Activity';

export async function getServerSideProps() {
  const firstScreenList = await activityStore.getList({}, 1, 12);

  return { props: { firstScreenList } };
}

const ActivityListPage = ({
  firstScreenList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Container>
    <PageHead title="热门活动" />

    <h2 className="text-center my-5">热门活动</h2>

    <ActivityList value={firstScreenList} />
  </Container>
);

export default ActivityListPage;
