import { InferGetServerSidePropsType } from 'next';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import ActivityEdit from '../../../../components/ActivityEdit';
import { withRoute } from '../../../api/core';
import activityStore, { Activity } from '../../../../models/Activity';

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
  <ActivityManageFrame name={params!.name} path={resolvedUrl} title="编辑活动">
    <ActivityEdit activity={activity} />
  </ActivityManageFrame>
);

export default ActivityEditPage;
