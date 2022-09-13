import PageHead from '../../../../../../../components/PageHead';
import WorkEdit from '../../../../../../../components/work/WorkEdit';
import { TeamWork } from '../../../../../../../models/Team';
import { withSession } from '../../../../../../api/user/session';
import type { InferGetServerSidePropsType } from 'next';
import { GetServerSidePropsContext } from 'next';
import { request } from '../../../../../../api/core';
export const getServerSideProps = withSession(
  async ({
    req,
    res,
    params: { name, tid, wid } = {},
  }: GetServerSidePropsContext<{
    name?: string;
    tid?: string;
    wid?: string;
  }>) => {
    if (!name || !tid || !wid)
      return {
        notFound: true,
        props: {} as { work: TeamWork },
      };

    const work = await request<TeamWork>(
      `hackathon/${name}/team/${tid}/work/${wid}`,
      'GET',
      undefined,
      { req, res },
    );
    return { props: { work } };
  },
);
const creatework = ({
  work,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <>
    <PageHead title="编辑作品" />

    <WorkEdit work={work} />
  </>
);

export default creatework;
