import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import PageHead from '../../../../components/PageHead';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import ActivityEdit from '../../../../components/ActivityEdit';
import activityStore, { Activity } from '../../../../models/Activity';
import { Team } from '../../../../models/Team';

interface EditPageProps {
  activity: Activity;
  teams: Team[];
  path: string;
  activityName: string;
}

export async function getServerSideProps({
  req,
  params: { name = '' } = {},
}: GetServerSidePropsContext<{ name?: string }>) {
  try {
    const activity = await activityStore.getOne(name);

    return {
      props: { activity, path: req.url, activityName: name },
    };
  } catch (error) {
    console.error(error);

    return {
      notFound: true,
      props: {} as EditPageProps,
    };
  }
}

const ActivityEditPage = ({
  activity,
  path,
  activityName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <ActivityManageFrame name={activityName} path={path}>
    <PageHead title={`${activityName}活动管理 编辑活动`} />

    <ActivityEdit activity={activity} />
  </ActivityManageFrame>
);

export default ActivityEditPage;
