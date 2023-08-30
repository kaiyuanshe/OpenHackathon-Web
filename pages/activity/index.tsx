import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { Container } from 'react-bootstrap';

import ActivityList from '../../components/Activity/ActivityList';
import PageHead from '../../components/layout/PageHead';
import { ActivityModel } from '../../models/Activity';
import { i18n } from '../../models/Translation';

const { t } = i18n;

export const getServerSideProps = compose(
  cache(),
  errorLogger,
  translator(i18n),
  async () => {
    const firstPage = await new ActivityModel().getList({}, 1, 12);

    return { props: { firstPage } };
  },
);

const ActivityListPage = observer(
  ({ firstPage }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
    <Container>
      <PageHead title={t('top_hackathons')} />

      <h2 className="text-center my-5">{t('top_hackathons')}</h2>

      <ActivityList defaultData={firstPage} />
    </Container>
  ),
);

export default ActivityListPage;
