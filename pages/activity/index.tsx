import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import ActivityList from '../../components/Activity/ActivityList';
import { PageHead } from '../../components/layout/PageHead';
import { ActivityModel } from '../../models/Activity';
import { I18nContext } from '../../models/Base/Translation';

export const getServerSideProps = compose(cache(), errorLogger, async () => {
  const firstPage = await new ActivityModel().getList({}, 1, 12);

  return { props: { firstPage } };
});

const ActivityListPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = observer(
  ({ firstPage }) => {
    const { t } = useContext(I18nContext);

    return (
      <Container>
        <PageHead title={t('top_hackathons')} />

        <h2 className="text-center my-5">{t('top_hackathons')}</h2>

        <ActivityList defaultData={firstPage} />
      </Container>
    );
  },
);
export default ActivityListPage;
