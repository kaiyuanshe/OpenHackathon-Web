import { InferGetServerSidePropsType } from 'next';
import { Container } from 'react-bootstrap';

import ActivityList from '../../components/Activity/ActivityList';
import PageHead from '../../components/PageHead';
import { ActivityModel } from '../../models/Activity';
import { i18n } from '../../models/Translation';

const { t } = i18n;

export async function getServerSideProps() {
  const firstScreenList = await new ActivityModel().getList({}, 1, 12);

  return { props: { firstScreenList } };
}

const ActivityListPage = ({
  firstScreenList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Container>
    <PageHead title={t('top_hackathons')} />

    <h2 className="text-center my-5">{t('top_hackathons')}</h2>

    <ActivityList defaultData={firstScreenList} />
  </Container>
);

export default ActivityListPage;
