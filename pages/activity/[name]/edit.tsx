import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import PageHead from '../../../components/PageHead';
import { withSession } from '../../api/user/session';
import { Activity } from '../../../models/Activity';
import { Team } from '../../../models/Team';
import { request } from '../../api/core';
import ActivityEdit from '../../../components/ActivityEdit';

export const getServerSideProps = withSession(
  async ({
    req,
    res,
    params: { name } = {},
  }: GetServerSidePropsContext<{ name?: string }>) => {
    if (!name)
      return {
        notFound: true,
        props: {} as { activity: Activity; teams: Team[] },
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

    return { props: { activity } };
  },
);

const editActivity = ({
  activity,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <>
    <PageHead title="编辑活动" />

    <ActivityEdit activity={activity} />
  </>
);

export default editActivity;
