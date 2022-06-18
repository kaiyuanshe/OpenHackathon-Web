import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import PageHead from '../../../../components/PageHead';
import { withSession } from '../../../api/user/session';
import { Activity } from '../../../../models/Activity';
import { Team } from '../../../../models/Team';
import { request } from '../../../api/core';
import ActivityEdit from '../../../../components/ActivityEdit';
import { ActivityManageFrame } from '../../../../components/ActivityManageFrame';

interface EditPageProps {
  activity: Activity;
  teams: Team[];
  path: string;
  activityName: string;
}

export const getServerSideProps = withSession(
  async ({
    req,
    res,
    params: { name } = {},
  }: GetServerSidePropsContext<{ name?: string }>) => {
    if (!name)
      return {
        notFound: true,
        props: {} as EditPageProps,
      };

    const activity = await request<Activity>(
      `hackathon/${name}`,
      'GET',
      undefined,
      { req, res },
    );

    if (activity.detail) {
      activity.detail = activity.detail
        .replace(/\\+n/g, '\n')
        .replace(/\\+t/g, ' ')
        .replace(/\\+"/g, '"');
    }

    return { props: { activity, path: req.url, activityName: name } };
  },
);

const editActivity = ({
  activity,
  path,
  activityName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <ActivityManageFrame name={activityName} path={path}>
    <PageHead title={`${activityName}活动管理 编辑活动`} />
    <ActivityEdit activity={activity} />
  </ActivityManageFrame>
);

export default editActivity;
