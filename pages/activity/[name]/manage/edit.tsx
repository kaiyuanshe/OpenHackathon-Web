import { t } from 'i18next';
import { InferGetServerSidePropsType } from 'next';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import ActivityEdit from '../../../../components/ActivityEdit';
import activityStore, { Activity } from '../../../../models/Activity';
import { withRoute } from '../../../api/core';

export const getServerSideProps = withRoute<
  { name: string },
  { activity: Activity }
>(async ({ params: { name = '' } = {} }) => {
  try {
    const activity = await activityStore.getOne(name);

    return { props: { activity } };
  } catch (error) {
    console.error(error);

    return { notFound: true };
  }
});

const ActivityEditPage = ({
  activity,
  route: { resolvedUrl, params },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <ActivityManageFrame
    name={params!.name}
    path={resolvedUrl}
    title={t('edit_activity')}
  >
    <ActivityEdit activity={activity} />
  </ActivityManageFrame>
);

export default ActivityEditPage;
