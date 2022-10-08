import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';

import PageHead from '../../../../../../../components/PageHead';
import WorkEdit from '../../../../../../../components/work/WorkEdit';
import { TeamWork } from '../../../../../../../models/Team';
import activityStore from '../../../../../../../models/Activity';

export async function getServerSideProps({
  req,
  params: { name = '', tid, wid } = {},
}: GetServerSidePropsContext<Partial<Record<'name' | 'tid' | 'wid', string>>>) {
  try {
    const work = await activityStore.teamOf(name).workOf(tid).getOne(wid);

    return {
      props: { work, path: req.url },
    };
  } catch (error) {
    console.error(error);

    return {
      notFound: true,
      props: {},
    };
  }
}
const creatework = ({
  work,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <>
    <PageHead title="编辑作品" />

    <WorkEdit work={work} />
  </>
);

export default creatework;
