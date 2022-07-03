import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { withSession } from '../../../../../api/user/session';
import { TeamWork } from '../../../../../../models/Team';
import { Team } from '../../../../../../models/Team';
import { request } from '../../../../../api/core';
import WorkEdit from '../../../../../../components/work/WorkEdit';

interface EditPageProps {
  work: TeamWork;
  teams: Team[];
  path: string;
}

export const getServerSideProps = withSession(
  async ({
    req,
    res,
    params: { tid, wid } = {},
  }: GetServerSidePropsContext<{ tid?: string; wid?: string }>) => {
    if (!wid)
      return {
        notFound: true,
        props: {} as EditPageProps,
      };

    const work = await request<TeamWork>(
      `hackathon/${tid}/team/${wid}/works`,
      'GET',
      undefined,
      { req, res },
    );
    return { props: { work } };
  },
);

const editWork = ({
  work,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <WorkEdit work={work} />
);

export default editWork;
