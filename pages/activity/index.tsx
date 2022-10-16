import { InferGetServerSidePropsType } from 'next';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import ActivityList from '../../components/Activity/ActivityList';
import activityStore from '../../models/Activity';
import { t } from 'i18next';

export async function getServerSideProps() {
  const firstScreenList = await activityStore.getList({}, 1, 12);

  return { props: { firstScreenList } };
}

const ActivityListPage = ({
  firstScreenList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Container>
    <PageHead title={t('top_hackathons')} />

    <h2 className="text-center my-5">{t('top_hackathons')}</h2>

    <ActivityList value={firstScreenList} />
  </Container>
);

export default ActivityListPage;
